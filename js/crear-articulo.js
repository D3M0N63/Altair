document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const form     = document.getElementById('create-article-form');
  const feedback = document.getElementById('feedback-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.className = 'adm-feedback';
    feedback.textContent = 'Subiendo imagen...';

    const imageFile = document.getElementById('imagen').files[0];

    try {
      // 1. Subir imagen a Cloudinary
      const imagen_portada_url = await uploadImage(imageFile);

      feedback.textContent = 'Guardando artículo...';

      // 2. Crear artículo en Neon via API
      await apiFetch('/articulos', {
        method: 'POST',
        body: JSON.stringify({
          titulo:   document.getElementById('titulo').value,
          resumen:  document.getElementById('resumen').value,
          contenido: document.getElementById('contenido').value,
          imagen_portada_url
        })
      });

      feedback.className = 'adm-feedback success';
      feedback.textContent = '¡Artículo guardado con éxito! Redirigiendo...';
      setTimeout(() => { window.location.href = '/admin/index.html'; }, 1500);

    } catch (err) {
      feedback.className = 'adm-feedback error';
      feedback.textContent = 'Error: ' + err.message;
    }
  });
});
