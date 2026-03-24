document.addEventListener('DOMContentLoaded', function() {
    loadProjectDetails();
});

async function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        document.getElementById('project-title').innerText = 'Proyecto no encontrado';
        document.getElementById('breadcrumb-title').innerText = 'Error';
        return;
    }

    const { data: project, error } = await supabaseClient
        .from('proyectos')
        .select('*')
        .eq('id', projectId)
        .single();

    if (error || !project) {
        console.error('Error al cargar el proyecto:', error);
        document.getElementById('project-title').innerText = 'No se pudo cargar el proyecto.';
        document.getElementById('breadcrumb-title').innerText = 'Error';
        return;
    }

    // --- Título y metadatos ---
    document.title = `${project.titulo} — Altair`;
    document.getElementById('project-title').innerText = project.titulo;

    const breadcrumb = document.getElementById('breadcrumb-title');
    if (breadcrumb) breadcrumb.innerText = project.titulo;

    // --- Imagen hero ---
    const projectImage       = document.getElementById('project-image');
    const imagePlaceholder   = document.getElementById('image-placeholder');

    if (project.imagen_url) {
        projectImage.src = project.imagen_url;
        projectImage.alt = `Imagen del proyecto ${project.titulo}`;
        projectImage.style.display = 'block';
        projectImage.onload = () => {
            if (imagePlaceholder) imagePlaceholder.style.display = 'none';
        };
    }

    // --- Link del proyecto ---
    const projectLink = document.getElementById('project-link');
    if (project.proyecto_url && projectLink) {
        projectLink.href = project.proyecto_url;
        projectLink.style.display = 'flex';
    }

    // --- Resumen ---
    const summaryContainer = document.getElementById('project-summary-content');
    if (summaryContainer) {
        if (project.funcionalidades && typeof project.funcionalidades === 'string') {
            summaryContainer.innerHTML = `<p>${project.funcionalidades.replace(/\n/g, '</p><p>')}</p>`;
        } else {
            summaryContainer.innerHTML = '<p style="font-family:var(--font-mono);font-size:.85rem;color:var(--color-texto-muted);">Sin descripción disponible.</p>';
        }
    }
}
