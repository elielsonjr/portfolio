/**
 * =========================================================
 * COMPORTAMENTO E LÓGICA DO PORTFÓLIO HÍBRIDO - ELIELSON JR.
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // Configurações GitHub
  const githubUsername = 'elielsonjr';
  const maxProjects = 5; // Quantidade de repositórios do GitHub a carregar
  const excludeRepos = ['elielsonjr'];
  
  // Elementos do DOM
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const projectsContainer = document.getElementById('github-projects');
  
  // ==========================================
  // MENU MOBILE RESPONSIVO
  // ==========================================
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-active');
      
      const icon = navToggle.querySelector('i');
      if (navMenu.classList.contains('mobile-active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });

    // Fechar menu mobile ao selecionar algum item
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });

    // Fechar menu ao clicar na tela fora do menu
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('mobile-active');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // ==========================================
  // EFEITO DE REVELAÇÃO AO ROLAR (SCROLL REVEAL)
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Para de observar o elemento já revelado
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback para navegadores legados
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }

  // ==========================================
  // REQUISIÇÃO E RENDERIZAÇÃO DO GITHUB
  // ==========================================
  async function loadGitHubProjects() {
    if (!projectsContainer) return;
    
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc`);
      if (!response.ok) throw new Error('Erro na conexão com API do GitHub');
      
      const repos = await response.json();
      
      // Filtra e limita repositórios reais
      const filteredRepos = repos
        .filter(repo => !repo.fork && !excludeRepos.includes(repo.name))
        .slice(0, maxProjects);
      
      // Retém o card fixo de design (primeiro filho) e apaga skeletons
      const designCard = projectsContainer.querySelector('.project-card:not(.skeleton)');
      projectsContainer.innerHTML = '';
      
      if (designCard) {
        projectsContainer.appendChild(designCard);
      }
      
      // Insere dinamicamente cada projeto do GitHub
      filteredRepos.forEach(repo => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
          <div class="project-icon"><i class="fab fa-github"></i></div>
          <h3 class="project-title">${repo.name}</h3>
          <p class="project-desc">
            ${repo.description || 'Repositório de desenvolvimento computacional sem descrição cadastrada.'}
          </p>
          <div class="project-tags">
            <span class="tag">${repo.language || 'Código'}</span>
            <span class="tag"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            <span class="tag"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
          </div>
          <a href="${repo.html_url}" target="_blank" class="project-link">
            Acessar Repositório <i class="fas fa-external-link-alt"></i>
          </a>
        `;
        
        projectsContainer.appendChild(projectCard);
      });
      
    } catch (error) {
      console.error('Erro ao carregar projetos do GitHub:', error);
      
      // Mantém o estático e remove skeletons
      const designCard = projectsContainer.querySelector('.project-card:not(.skeleton)');
      projectsContainer.innerHTML = '';
      if (designCard) {
        projectsContainer.appendChild(designCard);
      }
      
      // Card de erro profissional
      const errorCard = document.createElement('div');
      errorCard.className = 'project-card';
      errorCard.innerHTML = `
        <div class="project-icon"><i class="fas fa-network-wired"></i></div>
        <h3 class="project-title">Portais de Desenvolvimento</h3>
        <p class="project-desc">
          O portal dinâmico com a API do GitHub está temporariamente indisponível. Você pode conferir toda a minha linha de desenvolvimento acessando o meu perfil oficial diretamente.
        </p>
        <a href="https://github.com/${githubUsername}?tab=repositories" target="_blank" class="project-link">
          Acessar GitHub <i class="fas fa-external-link-alt"></i>
        </a>
      `;
      projectsContainer.appendChild(errorCard);
    }
  }

  // Inicializa a requisição
  loadGitHubProjects();
  
});