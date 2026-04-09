document.addEventListener('DOMContentLoaded', loadAllProjects);

async function loadAllProjects() {
  const portfolioGrid = document.getElementById('full-portfolio-grid');
  const emptyState    = document.getElementById('empty-state');
  const countEl       = document.getElementById('project-count');
  if (!portfolioGrid) return;

  try {
    const proyectos = await fetch('/api/proyectos').then(r => r.json());

    if (!proyectos.length) {
      portfolioGrid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (countEl) countEl.textContent = `— ${proyectos.length} proyecto${proyectos.length !== 1 ? 's' : ''}`;

    portfolioGrid.innerHTML = '';
    proyectos.forEach((project, index) => {
      const num  = String(index + 1).padStart(2, '0');
      const card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', String((index % 3) * 80));
      card.innerHTML = `
        <div class="project-card__image-wrap">
          <img src="${project.imagen_url}" alt="Imagen del proyecto ${project.titulo}" loading="lazy">
          <div class="project-card__overlay">
            <a href="proyecto-detalle.html?id=${project.id}" class="project-card__overlay-btn">Ver Proyecto →</a>
          </div>
          <span class="project-card__num">${num}</span>
        </div>
        <div class="project-card__body">
          <h3 class="project-card__title">${project.titulo}</h3>
          <p class="project-card__desc">${project.descripcion || ''}</p>
          <div class="project-card__footer">
            <a href="proyecto-detalle.html?id=${project.id}" class="project-card__link">
              Ver detalles <span class="project-card__arrow">→</span>
            </a>
          </div>
        </div>`;
      portfolioGrid.appendChild(card);
    });

    if (typeof AOS !== 'undefined') AOS.refresh();
  } catch (err) {
    portfolioGrid.innerHTML = '<p style="padding:2rem;font-family:var(--font-mono);font-size:.85rem;">Error al cargar proyectos.</p>';
  }
}
