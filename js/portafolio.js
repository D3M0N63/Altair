// Configuración de Supabase
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

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

    // Crea el HTML para cada tarjeta de proyecto (igual que en la página principal)
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