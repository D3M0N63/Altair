// Configuración de Supabase
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', function() {
    loadArticleDetails();
});

async function loadArticleDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        document.getElementById('article-title').innerText = 'Error: Artículo no encontrado';
        return;
    }

    const { data: article, error } = await supabaseClient
        .from('articulos')
        .select('*')
        .eq('id', articleId)
        .single();

    if (error || !article) {
        console.error('Error al cargar el artículo:', error);
        document.getElementById('article-title').innerText = 'Error: No se pudo cargar el artículo.';
        return;
    }

    document.title = article.titulo;
    document.getElementById('article-title').innerText = article.titulo;
    document.getElementById('article-meta').innerText = `Publicado el ${new Date(article.created_at).toLocaleDateString()}`;
    
    const articleImage = document.getElementById('article-image');
    articleImage.src = article.imagen_portada_url;
    articleImage.alt = `Imagen de portada para ${article.titulo}`;
    articleImage.style.display = 'block';

    // Para que el texto largo se formatee correctamente, usamos .innerHTML
    document.getElementById('article-content').innerHTML = article.contenido.replace(/\n/g, '<p></p>');
}