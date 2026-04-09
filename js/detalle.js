document.addEventListener('DOMContentLoaded', loadProjectDetails);

async function loadProjectDetails() {
  const id = new URLSearchParams(window.location.search).get('id');

  if (!id) {
    document.getElementById('project-title').innerText = 'Proyecto no encontrado';
    return;
  }

  try {
    const project = await fetch(`/api/proyectos/${id}`).then(r => r.json());

    document.title = `${project.titulo} — Altair`;
    document.getElementById('project-title').innerText = project.titulo;

    const breadcrumb = document.getElementById('breadcrumb-title');
    if (breadcrumb) breadcrumb.innerText = project.titulo;

    const projectImage     = document.getElementById('project-image');
    const imagePlaceholder = document.getElementById('image-placeholder');

    if (project.imagen_url && projectImage) {
      projectImage.src   = project.imagen_url;
      projectImage.alt   = `Imagen del proyecto ${project.titulo}`;
      projectImage.style.display = 'block';
      projectImage.onload = () => {
        if (imagePlaceholder) imagePlaceholder.style.display = 'none';
      };
    }

    const projectLink = document.getElementById('project-link');
    if (project.proyecto_url && projectLink) {
      projectLink.href = project.proyecto_url;
      projectLink.style.display = 'flex';
    }

    const summaryContainer = document.getElementById('project-summary-content');
    if (summaryContainer) {
      summaryContainer.innerHTML = project.funcionalidades
        ? `<p>${project.funcionalidades.replace(/\n/g, '</p><p>')}</p>`
        : '<p style="font-family:var(--font-mono);font-size:.85rem;">Sin descripción disponible.</p>';
    }
  } catch {
    document.getElementById('project-title').innerText = 'No se pudo cargar el proyecto.';
  }
}
