document.addEventListener('DOMContentLoaded', () => {
  const form         = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        errorMessage.textContent = data.error || 'Email o contraseña incorrectos.';
        return;
      }

      localStorage.setItem('altair_token', data.token);
      window.location.href = '/admin/index.html';

    } catch {
      errorMessage.textContent = 'Error de red. Intenta de nuevo.';
    }
  });
});
