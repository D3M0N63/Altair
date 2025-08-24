// Configuración de Supabase
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- FUNCIÓN DE GUARDIA: Protege la página ---
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        // Si no hay usuario, redirigir a la página de login
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
        // Redirigir a la página de login después de cerrar sesión
        window.location.href = '/login.html';
    }
}

// --- FUNCIÓN PARA CARGAR Y MOSTRAR PROYECTOS ---
async function displayProjects() {
    const { data: proyectos, error } = await supabaseClient.from('proyectos').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('proyectos-list');
    if (error || !proyectos) {
        list.innerHTML = '<li>Error al cargar proyectos.</li>';
        return;
    }
    list.innerHTML = proyectos.map(p => `<li>${p.titulo} <div><a href="#">Editar</a> | <a href="#">Borrar</a></div></li>`).join('');
}

// --- FUNCIÓN PARA CARGAR Y MOSTRAR ARTÍCULOS ---
async function displayArticles() {
    const { data: articulos, error } = await supabaseClient.from('articulos').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('articulos-list');
    if (error || !articulos) {
        list.innerHTML = '<li>Error al cargar artículos.</li>';
        return;
    }
    list.innerHTML = articulos.map(a => `<li>${a.titulo} <div><a href="#">Editar</a> | <a href="#">Borrar</a></div></li>`).join('');
}


// --- CÓDIGO PRINCIPAL QUE SE EJECUTA AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuth();
    if (user) {
        // Si el usuario está autenticado, ejecutar todo
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('logout-button').addEventListener('click', logout);
        
        displayProjects();
        displayArticles();
    }
});