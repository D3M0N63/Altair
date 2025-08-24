// Configuración de Supabase
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- LÓGICA DEL FORMULARIO DE LOGIN ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que la página se recargue

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Intenta iniciar sesión con Supabase Auth
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                // Si hay un error, lo muestra
                console.error('Error de inicio de sesión:', error.message);
                errorMessage.textContent = 'Email o contraseña incorrectos. Por favor, intenta de nuevo.';
            } else {
                // Si el inicio de sesión es exitoso, redirige al panel de administración
                console.log('Inicio de sesión exitoso:', data.user);
                window.location.href = '/admin/index.html';
            }
        });
    }
});