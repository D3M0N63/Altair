const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Auth Guard: Redirigir si el usuario no está logueado
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        window.location.href = '/login.html';
    }
}

// Lógica principal
document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Proteger la página

    const form = document.getElementById('create-project-form');
    const feedbackMessage = document.getElementById('feedback-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const proyecto_url = document.getElementById('proyecto_url').value;
        const imageFile = document.getElementById('imagen').files[0];

        feedbackMessage.textContent = 'Guardando, por favor espera...';
        
        // 1. Subir la imagen a Supabase Storage
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('imagenes-portafolio')
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error('Error subiendo imagen:', uploadError);
            feedbackMessage.textContent = 'Error al subir la imagen.';
            return;
        }

        // 2. Obtener la URL pública de la imagen subida
        const { data: urlData } = supabaseClient
            .storage
            .from('imagenes-portafolio')
            .getPublicUrl(fileName);

        const imagen_url = urlData.publicUrl;

        // 3. Insertar los datos en la tabla 'proyectos'
        const { data: insertData, error: insertError } = await supabaseClient
            .from('proyectos')
            .insert([
                { titulo, descripcion, proyecto_url, imagen_url }
            ]);

        if (insertError) {
            console.error('Error guardando proyecto:', insertError);
            feedbackMessage.textContent = 'Error al guardar el proyecto en la base de datos.';
        } else {
            feedbackMessage.textContent = '¡Proyecto guardado con éxito! Redirigiendo...';
            setTimeout(() => {
                window.location.href = '/admin/index.html';
            }, 2000);
        }
    });
});