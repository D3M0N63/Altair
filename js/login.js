// Se asume que el script de Supabase CDN ya se cargó y creó el objeto global 'supabase'
const { createClient } = supabase;

const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que la página se recargue

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            errorMessage.textContent = ''; // Limpiar errores previos

            // Intenta iniciar sesión con Supabase Auth
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                // Si hay un error, lo muestra
                console.error('Error de inicio de sesión:', error.message);
                errorMessage.textContent = 'Email o contraseña incorrectos.';
            } else {
                // Si el inicio de sesión es exitoso, redirige al panel de administración
                console.log('Inicio de sesión exitoso:', data.user);
                window.location.href = '/admin/index.html';
            }
        });
    }
});