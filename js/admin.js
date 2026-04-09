// admin.js — Panel de administración (usa js/api.js)

document.addEventListener('DOMContentLoaded', async () => {
  const user = requireAuth();
  if (!user) return;

  const emailEl = document.getElementById('user-email');
  if (emailEl) emailEl.textContent = user.email;

  const logoutBtn = document.getElementById('logout-button');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  await Promise.all([displayProjects(), displayArticles()]);

  // Delegación de eventos para borrar
  document.body.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.classList.contains('delete-project-btn')) {
      e.preventDefault();
      if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;
      try {
        await apiFetch(`/proyectos/${btn.dataset.id}`, { method: 'DELETE' });
        await displayProjects();
      } catch (err) {
        alert('No se pudo eliminar: ' + err.message);
      }
    }

    if (btn.classList.contains('delete-article-btn')) {
      e.preventDefault();
      if (!confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return;
      try {
        await apiFetch(`/articulos/${btn.dataset.id}`, { method: 'DELETE' });
        await displayArticles();
      } catch (err) {
        alert('No se pudo eliminar: ' + err.message);
      }
    }
  });
});

async function displayProjects() {
  const tbody = document.getElementById('proyectos-tbody');
  if (!tbody) return;

  try {
    const proyectos = await apiFetch('/proyectos');
    const statEl = document.getElementById('stat-proyectos');
    if (statEl) statEl.textContent = proyectos.length;

    if (!proyectos.length) {
      tbody.innerHTML = `<tr><td colspan="3"><div class="adm-empty"><p>Sin proyectos. <a href="crear-proyecto.html">Añadir uno →</a></p></div></td></tr>`;
      return;
    }

    tbody.innerHTML = proyectos.map(p => `
      <tr>
        <td>
          ${p.imagen_url
            ? `<img src="${p.imagen_url}" class="adm-table__thumb" alt="">`
            : `<div class="adm-table__thumb" style="background:var(--adm-surface);"></div>`}
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
  } catch {
    tbody.innerHTML = `<tr><td colspan="3"><div class="adm-empty"><p>Error al cargar proyectos.</p></div></td></tr>`;
  }
}

async function displayArticles() {
  const tbody = document.getElementById('articulos-tbody');
  if (!tbody) return;

  try {
    const articulos = await apiFetch('/articulos');
    const statEl = document.getElementById('stat-articulos');
    if (statEl) statEl.textContent = articulos.length;

    if (!articulos.length) {
      tbody.innerHTML = `<tr><td colspan="2"><div class="adm-empty"><p>Sin artículos. <a href="crear-articulo.html">Añadir uno →</a></p></div></td></tr>`;
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
  } catch {
    tbody.innerHTML = `<tr><td colspan="2"><div class="adm-empty"><p>Error al cargar artículos.</p></div></td></tr>`;
  }
}
