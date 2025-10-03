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

    // --- Rellenar datos principales ---
    document.title = `${project.titulo} | Detalles del Proyecto`;
    document.getElementById('project-title').innerText = project.titulo;
    const projectImage = document.getElementById('project-image');
    projectImage.src = project.imagen_url;
    projectImage.alt = `Imagen del proyecto ${project.titulo}`;
    projectImage.style.display = 'block';
    
    const projectLink = document.getElementById('project-link');
    if (project.proyecto_url) {
        projectLink.href = project.proyecto_url;
        projectLink.style.display = 'inline-block';
    }

    // --- Rellenar la sección de resumen/funcionalidades ---
    const featuresGrid = document.getElementById('project-features-grid');
    if (project.funcionalidades && typeof project.funcionalidades === 'string') {
        // Se asegura de que el contenedor esté vacío y luego añade el resumen
        featuresGrid.innerHTML = `<p>${project.funcionalidades.replace(/\n/g, '<br>')}</p>`;
    }
}