const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', function() {
    loadProjectDetails();
});

async function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        document.getElementById('project-title').innerText = 'Error: Proyecto no encontrado';
        return;
    }

    const { data: project, error } = await supabaseClient
        .from('proyectos')
        .select('*')
        .eq('id', projectId)
        .single();

    if (error || !project) {
        console.error('Error al cargar el proyecto:', error);
        document.getElementById('project-title').innerText = 'Error: No se pudo cargar el proyecto.';
        return;
    }

    // --- Rellenar datos principales (sin cambios) ---
    document.title = `${project.titulo} | Detalles del Proyecto`;
    document.getElementById('project-title').innerText = project.titulo;
    const projectImage = document.getElementById('project-image');
    projectImage.src = project.imagen_url;
    projectImage.alt = `Imagen del proyecto ${project.titulo}`;
    projectImage.style.display = 'block';
    document.getElementById('project-description').innerHTML = `<p>${project.descripcion.replace(/\n/g, '<br>')}</p>`;
    const projectLink = document.getElementById('project-link');
    if (project.proyecto_url) {
        projectLink.href = project.proyecto_url;
        projectLink.style.display = 'inline-block';
    }

    // --- NUEVO: Rellenar la sección de funcionalidades ---
    const featuresGrid = document.getElementById('project-features-grid');
    if (project.funcionalidades && Array.isArray(project.funcionalidades)) {
        project.funcionalidades.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.classList.add('feature-item');
            featureElement.innerHTML = `
                <img src="${feature.imagen_url}" alt="Imagen de la función ${feature.titulo}" loading="lazy">
                <div class="feature-text">
                    <h3>${feature.titulo}</h3>
                    <p>${feature.descripcion}</p>
                </div>
            `;
            featuresGrid.appendChild(featureElement);
        });
    }
}