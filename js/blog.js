document.addEventListener('DOMContentLoaded', loadAllArticles);

async function loadAllArticles() {
  const grid = document.getElementById('articles-grid-full');
  if (!grid) return;

  try {
    const articulos = await fetch('/api/articulos').then(r => r.json());

    if (!articulos.length) {
      grid.innerHTML = '<p>No hay artículos publicados aún.</p>';
      return;
    }

    grid.innerHTML = '';
    articulos.forEach(article => {
      const card = document.createElement('article');
      card.className = 'article';
      card.innerHTML = `
        <img src="${article.imagen_portada_url}" alt="Imagen de portada para ${article.titulo}" loading="lazy">
        <h3>${article.titulo}</h3>
        <p class="meta">Publicado el ${new Date(article.created_at).toLocaleDateString('es-PY')}</p>
        <p>${article.resumen}</p>
        <a href="articulo-detalle.html?id=${article.id}">Leer Más</a>`;
      grid.appendChild(card);
    });
  } catch {
    grid.innerHTML = '<p>Error al cargar los artículos.</p>';
  }
}
