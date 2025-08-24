const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Elementos del Formulario ---
const form = document.getElementById('edit-project-form');
const feedbackMessage = document.getElementById('feedback-message');
const tituloInput = document.getElementById('titulo');
const descripcionInput = document.getElementById('descripcion');
const proyectoUrlInput = document.getElementById('proyecto_url');
let currentProjectId = null;
let currentImageUrl = null;

// --- Auth Guard ---
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) window.location.href = '/login.html';
}

// --- Cargar datos del proyecto en el formulario ---
async function loadProjectData() {
    const urlParams = new URLSearchParams(window.location.search);
    currentProjectId = urlParams.get('id');
    if (!currentProjectId) {
        feedbackMessage.textContent = "Error: No se encontró el ID del proyecto.";
        return;
    }

    const { data: project, error } = await supabaseClient
        .from('proyectos')
        .select('*')
        .eq('id', currentProjectId)
        .single();

    if (error) {
        console.error('Error cargando datos del proyecto:', error);
        feedbackMessage.textContent = "No se pudieron cargar los datos del proyecto.";
    } else {
        tituloInput.value = project.titulo;
        descripcionInput.value = project.descripcion;
        proyectoUrlInput.value = project.proyecto_url;
        currentImageUrl = project.imagen_url;
    }
}

// --- Manejar la actualización del formulario ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedbackMessage.textContent = 'Actualizando, por favor espera...';

    const imageFile = document.getElementById('imagen').files[0];
    let newImageUrl = currentImageUrl;

    // Si se subió una nueva imagen, procesarla
    if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabaseClient.storage.from('imagenes-portafolio').upload(fileName, imageFile);
        if (uploadError) {
            console.error('Error subiendo nueva imagen:', uploadError);
            feedbackMessage.textContent = 'Error al subir la nueva imagen.';
            return;
        }
        const { data: urlData } = supabaseClient.storage.from('imagenes-portafolio').getPublicUrl(fileName);
        newImageUrl = urlData.publicUrl;
    }
    
    // Objeto con los datos a actualizar
    const updatedData = {
        titulo: tituloInput.value,
        descripcion: descripcionInput.value,
        proyecto_url: proyectoUrlInput.value,
        imagen_url: newImageUrl
    };

    // Actualizar el registro en la base de datos
    const { error: updateError } = await supabaseClient
        .from('proyectos')
        .update(updatedData)
        .eq('id', currentProjectId);

    if (updateError) {
        console.error('Error actualizando proyecto:', updateError);
        feedbackMessage.textContent = 'Error al actualizar el proyecto.';
    } else {
        feedbackMessage.textContent = '¡Proyecto actualizado con éxito! Redirigiendo...';
        setTimeout(() => { window.location.href = '/admin/index.html'; }, 2000);
    }
});


// --- Código principal que se ejecuta al cargar la página ---
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadProjectData();
});