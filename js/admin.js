// Configuración de Supabase
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Guardia de autenticación ---
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) window.location.href = '/login.html';
    return user;
}

// --- Cerrar sesión ---
async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = '/login.html';
}

// --- Mostrar proyectos ---
async function displayProjects() {
    const tbody = document.getElementById('proyectos-tbody');
    if (!tbody) return;

    const { data: proyectos, error } = await supabaseClient
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false });

    const statEl = document.getElementById('stat-proyectos');

    if (error || !proyectos) {
        tbody.innerHTML = `<tr><td colspan="3"><div class="adm-empty"><p>Error al cargar proyectos.</p></div></td></tr>`;
        return;
    }

    if (statEl) statEl.textContent = proyectos.length;

    if (proyectos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3"><div class="adm-empty"><p>No hay proyectos. <a href="crear-proyecto.html">Añadir uno →</a></p></div></td></tr>`;
        return;
    }

    tbody.innerHTML = proyectos.map(p => `
        <tr>
            <td>
                ${p.imagen_url
                    ? `<img src="${p.imagen_url}" class="adm-table__thumb" alt="">`
                    : `<div class="adm-table__thumb" style="background:var(--adm-surface);"></div>`
                }
            </td>
            <td>
                <div class="adm-table__name">${p.titulo}</div>
                <div class="adm-table__meta">${new Date(p.created_at).toLocaleDateString('es-PY', { day:'2-digit', month:'short', year:'numeric' })}</div>
            </td>
            <td>
                <div class="adm-table__actions">
                    <a href="editar-proyecto.html?id=${p.id}" class="btn btn-ghost">
                        <i class="fas fa-pencil-alt"></i> Editar
                    </a>
                    <button class="btn btn-danger delete-project-btn" data-id="${p.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// --- Mostrar artículos ---
async function displayArticles() {
    const tbody = document.getElementById('articulos-tbody');
    if (!tbody) return;

    const { data: articulos, error } = await supabaseClient
        .from('articulos')
        .select('*')
        .order('created_at', { ascending: false });

    const statEl = document.getElementById('stat-articulos');

    if (error || !articulos) {
        tbody.innerHTML = `<tr><td colspan="2"><div class="adm-empty"><p>Error al cargar artículos.</p></div></td></tr>`;
        return;
    }

    if (statEl) statEl.textContent = articulos.length;

    if (articulos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2"><div class="adm-empty"><p>No hay artículos. <a href="crear-articulo.html">Añadir uno →</a></p></div></td></tr>`;
        return;
    }

    tbody.innerHTML = articulos.map(a => `
        <tr>
            <td>
                <div class="adm-table__name">${a.titulo}</div>
                <div class="adm-table__meta">${new Date(a.created_at).toLocaleDateString('es-PY', { day:'2-digit', month:'short', year:'numeric' })}</div>
            </td>
            <td>
                <div class="adm-table__actions">
                    <button class="btn btn-danger delete-article-btn" data-id="${a.id}">
                        <i class="fas fa-trash"></i> Borrar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// --- Eliminar proyecto ---
async function deleteProject(id) {
    const { error } = await supabaseClient.from('proyectos').delete().eq('id', id);
    if (error) { alert('No se pudo eliminar el proyecto.'); return; }
    displayProjects();
}

// --- Eliminar artículo ---
async function deleteArticle(id) {
    const { error } = await supabaseClient.from('articulos').delete().eq('id', id);
    if (error) { alert('No se pudo eliminar el artículo.'); return; }
    displayArticles();
}

// --- Init ---
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuth();
    if (!user) return;

    const emailEl = document.getElementById('user-email');
    if (emailEl) emailEl.textContent = user.email;

    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    displayProjects();
    displayArticles();

    document.body.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        if (btn.classList.contains('delete-project-btn')) {
            e.preventDefault();
            if (confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) {
                await deleteProject(btn.dataset.id);
            }
        }

        if (btn.classList.contains('delete-article-btn')) {
            e.preventDefault();
            if (confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) {
                await deleteArticle(btn.dataset.id);
            }
        }
    });
});
