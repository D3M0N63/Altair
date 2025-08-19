// ===============================================
// == 1. SUPABASE CONFIGURATION                 ==
// ===============================================
const SUPABASE_URL = 'https://sfiyutjuwxejldjgfehw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmaXl1dGp1d3hlamxkamdmZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDcyMzcsImV4cCI6MjA3MTE4MzIzN30.jGKpVh2iRjKv-eScelLUOKu3bUEUhxxwSVes7y-ffGg';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// ===============================================
// == 2. MAIN SCRIPT EXECUTION                  ==
// ===============================================
// Wait for the entire HTML document to be loaded before running any scripts
document.addEventListener('DOMContentLoaded', function() {

    // --- Logic for Mobile Side Menu ---
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


    // --- Logic for Back to Top Button ---
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


    // --- Logic for Active Nav Link on Scroll ---
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".main-nav-desktop a");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove("active"));
                const id = entry.target.getAttribute("id");
                const activeLink = document.querySelector(`.main-nav-desktop a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    
    // --- Logic to Load Portfolio Projects from Supabase ---
    async function loadProjects() {
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (!portfolioGrid) return;

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

    loadProjects();

}); // --- End of DOMContentLoaded ---