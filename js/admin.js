// Configuración de Supabase
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- FUNCIÓN DE GUARDIA: Protege la página ---
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        window.location.href = '/login.html';
    }
    return user;
}

// --- FUNCIÓN PARA CERRAR SESIÓN ---
async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Error al cerrar sesión', error);
    } else {
        window.location.href = '/login.html';
    }
}

// --- FUNCIONES PARA PROYECTOS ---
async function displayProjects() {
    const list = document.getElementById('proyectos-list');
    
    // CORREGIDO: Se elimina la parte mal formada del order
    const { data: proyectos, error } = await supabaseClient
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !proyectos) {
        list.innerHTML = '<li>Error al cargar proyectos.</li>';
        return;
    }
    list.innerHTML = proyectos.map(p => `
        <li>
            ${p.titulo} 
            <div>
                <a href="editar-proyecto.html?id=${p.id}">Editar</a> | 
                <a href="#" class="delete-project-btn" data-id="${p.id}">Borrar</a>
            </div>
        </li>
    `).join('');
}

async function deleteProject(projectId) {
    const { error } = await supabaseClient.from('proyectos').delete().eq('id', projectId);
    if (error) {
        console.error('Error al eliminar el proyecto:', error);
        alert('No se pudo eliminar el proyecto.');
    } else {
        alert('Proyecto eliminado con éxito.');
        displayProjects(); // Recargamos la lista para mostrar el cambio
    }
}

// --- FUNCIONES PARA ARTÍCULOS ---
async function displayArticles() {
    const list = document.getElementById('articulos-list');

    // CORREGIDO: Se elimina la parte mal formada del order
    const { data: articulos, error } = await supabaseClient
        .from('articulos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !articulos) {
        list.innerHTML = '<li>Error al cargar artículos.</li>';
        return;
    }
    list.innerHTML = articulos.map(a => `
        <li>
            ${a.titulo} 
            <div>
                <a href="editar-articulo.html?id=${a.id}">Editar</a> | 
                <a href="#" class="delete-article-btn" data-id="${a.id}">Borrar</a>
            </div>
        </li>
    `).join('');
}

async function deleteArticle(articleId) {
    const { error } = await supabaseClient.from('articulos').delete().eq('id', articleId);
    if (error) {
        console.error('Error al eliminar el artículo:', error);
        alert('No se pudo eliminar el artículo.');
    } else {
        alert('Artículo eliminado con éxito.');
        displayArticles(); // Recargamos la lista para mostrar el cambio
    }
}

// --- CÓDIGO PRINCIPAL QUE SE EJECUTA AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuth();
    if (user) {
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('logout-button').addEventListener('click', logout);
        
        displayProjects();
        displayArticles();

        document.body.addEventListener('click', async (e) => {
            if (e.target && e.target.classList.contains('delete-project-btn')) {
                e.preventDefault();
                const idToDelete = e.target.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
                    await deleteProject(idToDelete);
                }
            }

            if (e.target && e.target.classList.contains('delete-article-btn')) {
                e.preventDefault();
                const idToDelete = e.target.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
                    await deleteArticle(idToDelete);
                }
            }
        });
    }
});