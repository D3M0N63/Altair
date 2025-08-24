// Configuración de Supabase
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Cargar todos los artículos cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    loadAllArticles();
});

async function loadAllArticles() {
    const articlesGrid = document.getElementById('articles-grid-full');
    if (!articlesGrid) return;

    const { data: articulos, error } = await supabaseClient
        .from('articulos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al cargar artículos:', error);
        return;
    }

    articlesGrid.innerHTML = ''; 

    articulos.forEach(article => {
        const articleCard = document.createElement('article');
        articleCard.classList.add('article');
        articleCard.innerHTML = `
            <img src="${article.imagen_portada_url}" alt="Imagen de portada para ${article.titulo}" loading="lazy">
            <h3>${article.titulo}</h3>
            <p class="meta">Publicado el ${new Date(article.created_at).toLocaleDateString()}</p>
            <p>${article.resumen}</p>
            <a href="articulo-detalle.html?id=${article.id}">Leer Más</a>
        `;
        articlesGrid.appendChild(articleCard);
    });
}