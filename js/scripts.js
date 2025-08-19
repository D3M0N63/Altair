// Espera a que todo el contenido del HTML esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function() {

    // =====================================
    // LÓGICA DEL MENÚ LATERAL MÓVIL
    // =====================================

    // Seleccionamos todos los elementos necesarios para el menú
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const menuLinks = sideMenu.querySelectorAll('a');

    // Función para abrir el menú
    function openMenu() {
        if (sideMenu && mainContent && overlay && menuToggle) {
            sideMenu.classList.add('open');
            mainContent.classList.add('shifted');
            overlay.classList.add('visible');
            menuToggle.classList.add('is-active');
        }
    }

    // Función para cerrar el menú
    function closeMenu() {
        if (sideMenu && mainContent && overlay && menuToggle) {
            sideMenu.classList.remove('open');
            mainContent.classList.remove('shifted');
            overlay.classList.remove('visible');
            menuToggle.classList.remove('is-active');
        }
    }

    // Evento para abrir el menú con el botón de hamburguesa
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que el clic se propague
            const isMenuOpen = sideMenu.classList.contains('open');
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Evento para cerrar el menú con el botón 'X' de adentro
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
    }

    // Evento para cerrar el menú haciendo clic en la superposición (overlay)
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    // Evento para cerrar el menú al hacer clic en uno de los enlaces
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });


    // =====================================
    // LÓGICA DEL BOTÓN DE VOLVER ARRIBA
    // =====================================

    // Seleccionamos el botón
    const backToTopBtn = document.getElementById('back-to-top');

    // Esta función se ejecutará cada vez que el usuario haga scroll
    function scrollFunction() {
        // Nos aseguramos de que el botón exista antes de intentar usarlo
        if (backToTopBtn) {
            // Si el scroll vertical es mayor a 300px, muestra el botón. Si no, lo oculta.
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }

    // Asignamos la función al evento 'scroll' de la ventana
    window.onscroll = function() {
        scrollFunction();
    };


    // ===============================================
// LÓGICA PARA RESALTAR EL ENLACE DEL MENÚ AL HACER SCROLL
// ===============================================

// 1. Seleccionar todas las secciones que tienen un ID
const sections = document.querySelectorAll("section[id]");

// 2. Seleccionar todos los enlaces del menú principal
const navLinks = document.querySelectorAll(".main-nav-desktop a");

// 3. Crear el observador
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Cuando una sección entra en la vista...

            // Limpiamos la clase 'active' de todos los enlaces
            navLinks.forEach(link => {
                link.classList.remove("active");
            });

            // Encontramos el enlace que corresponde a la sección visible
            const id = entry.target.getAttribute("id");
            const activeLink = document.querySelector(`.main-nav-desktop a[href="#${id}"]`);
            
            // Si encontramos el enlace, le añadimos la clase 'active'
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    });
}, {
    // Opciones del observador
    threshold: 0.5 // La sección se considera "activa" cuando el 50% de ella es visible
});

// 4. Hacer que el observador vigile cada sección
sections.forEach(section => {
    observer.observe(section);
});
 // ===============================================
    // == LOAD PORTFOLIO PROJECTS FROM SUPABASE     ==
    // ===============================================

    async function loadProjects() {
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (!portfolioGrid) return; // Exit if the grid isn't on the page

        // Fetch data from the 'proyectos' table
        const { data: proyectos, error } = await supabase
            .from('proyectos')
            .select('*');

        if (error) {
            console.error('Error fetching projects:', error);
            portfolioGrid.innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
            return;
        }

        if (proyectos.length === 0) {
            portfolioGrid.innerHTML = '<p>Actualmente no hay proyectos para mostrar.</p>';
            return;
        }

        // Clear any existing content
        portfolioGrid.innerHTML = ''; 

        // Create HTML for each project and add it to the grid
        proyectos.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project');
            projectCard.setAttribute('data-aos', 'fade-up');

            projectCard.innerHTML = `
                <img src="${project.imagen_url}" alt="Imagen del proyecto ${project.titulo}">
                <h3>${project.titulo}</h3>
                <p>${project.descripcion}</p>
                <a href="${project.proyecto_url}" target="_blank">Ver Detalles</a>
            `;

            portfolioGrid.appendChild(projectCard);
        });
    }

    // Call the function to load projects when the page loads
    loadProjects();



}); // Fin del addEventListener 'DOMContentLoaded'

// ===============================================
// == SUPABASE CONFIGURATION                  ==
// ===============================================

const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co'; // <-- Pega tu URL aquí
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg'; // <-- Pega tu clave pública aquí

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===============================================