document.addEventListener('DOMContentLoaded', function() {
    loadAllProjects();
});

async function loadAllProjects() {
    const portfolioGrid = document.getElementById('full-portfolio-grid');
    const emptyState    = document.getElementById('empty-state');
    const countEl       = document.getElementById('project-count');
    if (!portfolioGrid) return;

    const { data: proyectos, error } = await supabaseClient
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al cargar proyectos:', error);
        portfolioGrid.innerHTML = '<p style="padding:2rem;font-family:var(--font-mono);font-size:.85rem;">Error al cargar proyectos.</p>';
        return;
    }

    if (proyectos.length === 0) {
        portfolioGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    // Actualizar contador
    if (countEl) {
        countEl.textContent = `— ${proyectos.length} proyecto${proyectos.length !== 1 ? 's' : ''}`;
    }

    portfolioGrid.innerHTML = '';

    proyectos.forEach((project, index) => {
        const num = String(index + 1).padStart(2, '0');
        const card = document.createElement('div');
        card.classList.add('project-card');
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
                        Ver detalles
                        <span class="project-card__arrow">→</span>
                    </a>
                </div>
            </div>
        `;
        portfolioGrid.appendChild(card);
    });

    // Re-iniciar AOS para las nuevas cards
    if (typeof AOS !== 'undefined') AOS.refresh();
}
