// ===============================================
// == 1. SUPABASE CONFIGURATION                 ==
// ===============================================
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJI-eScelLUOKu3bUEUhxxwSVes7y-ffGg'; // Tu clave pública

// CORRECCIÓN CRÍTICA: La librería global se llama 'supabase'. Creamos nuestro cliente con un nombre nuevo, 'supabaseClient'.
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);


// ===============================================
// == 2. MAIN SCRIPT EXECUTION                  ==
// ===============================================
// Espera a que todo el contenido del HTML esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica del Menú Lateral Móvil ---
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const menuLinks = sideMenu.querySelectorAll('a');

    function openMenu() {
        if (sideMenu && mainContent && overlay && menuToggle) {
            sideMenu.classList.add('open');
            mainContent.classList.add('shifted');
            overlay.classList.add('visible');
            menuToggle.classList.add('is-active');
        }
    }

    function closeMenu() {
        if (sideMenu && mainContent && overlay && menuToggle) {
            sideMenu.classList.remove('open');
            mainContent.classList.remove('shifted');
            overlay.classList.remove('visible');
            menuToggle.classList.remove('is-active');
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (sideMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });


    // --- Lógica del Botón de Volver Arriba ---
    const backToTopBtn = document.getElementById('back-to-top');

    function scrollFunction() {
        if (backToTopBtn) {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }

    window.onscroll = function() {
        scrollFunction();
    };


    // --- Lógica para Resaltar el Enlace del Menú al Hacer Scroll ---
    const sections = document.querySelectorAll("section[id]");
    const navLinksDesktop = document.querySelectorAll(".main-nav-desktop a");
    const navLinksMobile = document.querySelectorAll(".side-nav a");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinksDesktop.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add("active");
                    }
                });

                navLinksMobile.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    
    // --- Lógica para Cargar Proyectos del Portafolio desde Supabase ---
    async function loadProjects() {
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (!portfolioGrid) return;

        // CORRECCIÓN CRÍTICA: Usamos la variable "supabaseClient" para llamar a la base de datos.
        const { data: proyectos, error } = await supabaseClient
            .from('proyectos')
            .select('*');

        if (error) {
            console.error('Error al cargar proyectos:', error);
            portfolioGrid.innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
            return;
        }

        if (proyectos.length === 0) {
            portfolioGrid.innerHTML = '<p>Actualmente no hay proyectos para mostrar.</p>';
            return;
        }

        portfolioGrid.innerHTML = ''; 

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

    // Llamamos a la función para cargar los proyectos
    loadProjects();

}); // --- FIN del DOMContentLoaded ---