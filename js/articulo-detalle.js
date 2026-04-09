document.addEventListener('DOMContentLoaded', loadArticleDetails);

async function loadArticleDetails() {
  const id = new URLSearchParams(window.location.search).get('id');

  if (!id) {
    document.getElementById('article-title').innerText = 'Artículo no encontrado';
    return;
  }

  try {
    const article = await fetch(`/api/articulos/${id}`).then(r => r.json());

    document.title = `${article.titulo} — Altair`;
    document.getElementById('article-title').innerText  = article.titulo;
    document.getElementById('article-meta').innerText   = `Publicado el ${new Date(article.created_at).toLocaleDateString('es-PY')}`;

    const img = document.getElementById('article-image');
    if (img && article.imagen_portada_url) {
      img.src   = article.imagen_portada_url;
      img.alt   = `Imagen de portada para ${article.titulo}`;
      img.style.display = 'block';
    }

    const content = document.getElementById('article-content');
    if (content) {
      content.innerHTML = article.contenido
        ? article.contenido.replace(/\n/g, '<p></p>')
        : '';
    }
  } catch {
    document.getElementById('article-title').innerText = 'Error al cargar el artículo.';
  }
}
