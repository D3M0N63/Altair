let currentImageUrl = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;
  await loadProjectData();

  document.getElementById('edit-project-form').addEventListener('submit', handleUpdate);
});

async function loadProjectData() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return;

  try {
    const project = await apiFetch(`/proyectos/${id}`);
    document.getElementById('titulo').value       = project.titulo;
    document.getElementById('descripcion').value  = project.descripcion || '';
    document.getElementById('resumen').value      = project.funcionalidades || '';
    document.getElementById('proyecto_url').value = project.proyecto_url || '';
    currentImageUrl = project.imagen_url;

    const preview = document.getElementById('image-preview');
    if (preview && project.imagen_url) {
      preview.src = project.imagen_url;
      preview.style.display = 'block';
    }
  } catch (err) {
    alert('No se pudo cargar el proyecto: ' + err.message);
  }
}

async function handleUpdate(e) {
  e.preventDefault();
  const id       = new URLSearchParams(window.location.search).get('id');
  const feedback = document.getElementById('feedback-message');
  feedback.className = 'adm-feedback';
  feedback.textContent = 'Guardando cambios...';

  try {
    const imageFile = document.getElementById('imagen').files[0];
    const imagen_url = imageFile ? await uploadImage(imageFile) : currentImageUrl;

    await apiFetch(`/proyectos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        titulo:          document.getElementById('titulo').value,
        descripcion:     document.getElementById('descripcion').value,
        funcionalidades: document.getElementById('resumen').value,
        proyecto_url:    document.getElementById('proyecto_url').value,
        imagen_url
      })
    });

    feedback.className = 'adm-feedback success';
    feedback.textContent = '¡Proyecto actualizado! Redirigiendo...';
    setTimeout(() => { window.location.href = '/admin/index.html'; }, 1500);

  } catch (err) {
    feedback.className = 'adm-feedback error';
    feedback.textContent = 'Error: ' + err.message;
  }
}
