document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const form    = document.getElementById('create-project-form');
  const feedback = document.getElementById('feedback-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.className = 'adm-feedback';
    feedback.textContent = 'Subiendo imagen...';

    const imageFile = document.getElementById('imagen').files[0];

    try {
      // 1. Subir imagen a Cloudinary
      const imagen_url = await uploadImage(imageFile);

      feedback.textContent = 'Guardando proyecto...';

      // 2. Crear proyecto en Neon via API
      await apiFetch('/proyectos', {
        method: 'POST',
        body: JSON.stringify({
          titulo:          document.getElementById('titulo').value,
          descripcion:     document.getElementById('descripcion').value,
          funcionalidades: document.getElementById('resumen').value,
          proyecto_url:    document.getElementById('proyecto_url').value,
          imagen_url
        })
      });

      feedback.className = 'adm-feedback success';
      feedback.textContent = '¡Proyecto guardado con éxito! Redirigiendo...';
      setTimeout(() => { window.location.href = '/admin/index.html'; }, 1500);

    } catch (err) {
      feedback.className = 'adm-feedback error';
      feedback.textContent = 'Error: ' + err.message;
    }
  });
});
