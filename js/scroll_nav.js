document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.main-nav');
    const filterBar = document.querySelector('.filter-bar');
    const backToTopBtn = document.getElementById('backToTop');

    function updateNavHeight() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop <= 10) {
            navbar.classList.remove('compact');
            navbar.style.setProperty('--nav-shift', '0px');
        } else {
            navbar.classList.add('compact');
            
            // CALCULAMOS LA MAGIA:
            // Tomamos la distancia desde el tope de la nav hasta el inicio de la barra de filtros
            const shift = filterBar.offsetTop;
            navbar.style.setProperty('--nav-shift', `-${shift}px`);
        }
    }

    window.addEventListener('scroll', updateNavHeight);

    // Si cambias de marca o plataforma, el alto puede cambiar, 
    // así que recalculamos después de un pequeño delay
    document.addEventListener('click', () => {
        setTimeout(updateNavHeight, 100);
    });

    // Lógica del botón volver arriba
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
