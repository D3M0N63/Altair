// ================================================
// js/api.js — Utilidades compartidas
// Reemplaza el cliente de Supabase en todo el proyecto
// ================================================

// --- Auth helpers (frontend) ---

function getToken() {
  return localStorage.getItem('altair_token');
}

function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('altair_token');
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function requireAuth() {
  const user = getUser();
  if (!user) { window.location.href = '/login.html'; return null; }
  return user;
}

function logout() {
  localStorage.removeItem('altair_token');
  window.location.href = '/login.html';
}

// --- Fetch helper ---

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  Object.assign(headers, options.headers || {});

  const res = await fetch('/api' + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

// --- Cloudinary upload (unsigned) ---
// Configura CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET
// en las variables de entorno de Vercel y ponlos aquí:
const CLOUDINARY_CLOUD_NAME = 'dsii8rxo1';      // ← reemplaza
const CLOUDINARY_UPLOAD_PRESET = 'altair';  // ← reemplaza (unsigned)

async function uploadImage(file) {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: form }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
}
