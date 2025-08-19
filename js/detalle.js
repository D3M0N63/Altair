// Configuración de Supabase (igual que en tu script principal)
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Función principal que se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    loadProjectDetails();
});

// Función para cargar los detalles del proyecto
async function loadProjectDetails() {
    // 1. Leer el ID del proyecto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    // Si no hay ID en la URL, mostrar un error
    if (!projectId) {
        document.getElementById('project-title').innerText = 'Error: Proyecto no encontrado';
        return;
    }

    // 2. Buscar el proyecto en Supabase usando el ID
    const { data: project, error } = await supabaseClient
        .from('proyectos')
        .select('*')
        .eq('id', projectId) // Busca la fila donde la columna 'id' coincida con nuestro projectId
        .single(); // Le decimos que esperamos solo un resultado

    if (error || !project) {
        console.error('Error al cargar el proyecto:', error);
        document.getElementById('project-title').innerText = 'Error: No se pudo cargar el proyecto.';
        return;
    }

    // 3. Rellenar el HTML con los datos del proyecto
    document.title = `${project.titulo} | Detalles del Proyecto`; // Actualizar el título de la pestaña
    document.getElementById('project-title').innerText = project.titulo;
    
    const projectImage = document.getElementById('project-image');
    projectImage.src = project.imagen_url;
    projectImage.alt = `Imagen del proyecto ${project.titulo}`;
    projectImage.style.display = 'block';

    document.getElementById('project-description').innerHTML = `<p>${project.descripcion.replace(/\n/g, '<br>')}</p>`; // Reemplaza saltos de línea con <br>
    
    const projectLink = document.getElementById('project-link');
    if (project.proyecto_url) {
        projectLink.href = project.proyecto_url;
        projectLink.style.display = 'inline-block';
    }
}