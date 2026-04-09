// ===============================================
// == SCRIPTS.JS — sin dependencia de Supabase ==
// ===============================================

document.addEventListener('DOMContentLoaded', function() {

  // --- Menú lateral móvil ---
  const menuToggle = document.getElementById('menu-toggle');
  const sideMenu   = document.getElementById('side-menu');
  const mainContent = document.getElementById('main-content');
  const overlay    = document.getElementById('overlay');
  const closeBtn   = document.querySelector('.close-btn');

  function openMenu() {
    sideMenu?.classList.add('open');
    mainContent?.classList.add('shifted');
    overlay?.classList.add('visible');
    menuToggle?.classList.add('is-active');
  }

  function closeMenu() {
    sideMenu?.classList.remove('open');
    mainContent?.classList.remove('shifted');
    overlay?.classList.remove('visible');
    menuToggle?.classList.remove('is-active');
  }

  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    sideMenu?.classList.contains('open') ? closeMenu() : openMenu();
  });

  closeBtn?.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); });
  overlay?.addEventListener('click', closeMenu);

  sideMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // --- Botón volver arriba ---
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (!backToTopBtn) return;
    backToTopBtn.classList.toggle('show', window.scrollY > 300);
  });

  // --- Resaltar nav al hacer scroll ---
  const sections         = document.querySelectorAll('section[id]');
  const navLinksDesktop  = document.querySelectorAll('.main-nav-desktop a');
  const navLinksMobile   = document.querySelectorAll('.side-nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      [...navLinksDesktop, ...navLinksMobile].forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));

  // --- Cargar proyectos en la página de inicio ---
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (portfolioGrid) loadHomepageProjects(portfolioGrid);

  // --- Cargar artículos en la sección blog del inicio ---
  const articlesPreview = document.querySelector('.articles-grid');
  if (articlesPreview) loadHomepageArticles(articlesPreview);
});

async function loadHomepageProjects(grid) {
  try {
    const proyectos = await fetch('/api/proyectos').then(r => r.json());
    if (!proyectos.length) {
      grid.innerHTML = '<p>Actualmente no hay proyectos para mostrar.</p>';
      return;
    }
    grid.innerHTML = '';
    proyectos.slice(0, 6).forEach(project => {
      const card = document.createElement('div');
      card.className = 'project';
      card.setAttribute('data-aos', 'fade-up');
      card.innerHTML = `
        <img loading="lazy" src="${project.imagen_url}" alt="Imagen del proyecto ${project.titulo}">
        <h3>${project.titulo}</h3>
        <p>${project.descripcion || ''}</p>
        <a href="proyecto-detalle.html?id=${project.id}">Ver Detalles</a>`;
      grid.appendChild(card);
    });
  } catch {
    grid.innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
  }
}

async function loadHomepageArticles(grid) {
  try {
    const articulos = await fetch('/api/articulos').then(r => r.json());
    grid.innerHTML = '';
    articulos.slice(0, 3).forEach(article => {
      const card = document.createElement('article');
      card.className = 'article';
      card.innerHTML = `
        <img src="${article.imagen_portada_url}" alt="" loading="lazy">
        <h3>${article.titulo}</h3>
        <p class="meta">${new Date(article.created_at).toLocaleDateString('es-PY')}</p>
        <p>${article.resumen}</p>
        <a href="articulo-detalle.html?id=${article.id}">Leer Más</a>`;
      grid.appendChild(card);
    });
  } catch { /* silencioso */ }
}
