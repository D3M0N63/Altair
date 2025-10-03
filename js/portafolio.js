// Cargar todos los proyectos cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    loadAllProjects();
});

async function loadAllProjects() {
    const portfolioGrid = document.getElementById('full-portfolio-grid');
    if (!portfolioGrid) return;

    // Busca todos los proyectos, ordenados por fecha de creación
    const { data: proyectos, error } = await supabaseClient
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al cargar proyectos:', error);
        portfolioGrid.innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
        return;
    }

    if (proyectos.length === 0) {
        portfolioGrid.innerHTML = '<p>No hay proyectos para mostrar.</p>';
        return;
    }

    portfolioGrid.innerHTML = ''; 

    // Crea el HTML para cada tarjeta de proyecto
    proyectos.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project');
        projectCard.innerHTML = `
            <img src="${project.imagen_url}" alt="Imagen del proyecto ${project.titulo}" loading="lazy">
            <h3>${project.titulo}</h3>
            <p>${project.descripcion}</p>
            <a href="proyecto-detalle.html?id=${project.id}">Ver Detalles</a>
        `;
        portfolioGrid.appendChild(projectCard);
    });
}