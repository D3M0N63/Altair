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

    // --- Rellenar la sección de resumen ---
    const summaryContainer = document.getElementById('project-summary-content');
    if (project.funcionalidades && typeof project.funcionalidades === 'string') {
        summaryContainer.innerHTML = `<p>${project.funcionalidades.replace(/\n/g, '<br>')}</p>`;
    }
}