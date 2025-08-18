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

}); // Fin del addEventListener 'DOMContentLoaded'