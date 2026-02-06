let lastScrollTop = 0;
const navbar = document.querySelector('.main-nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Si bajamos scroll, ocultamos. Si subimos, mostramos.
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        // Scroll hacia abajo
        navbar.classList.add('nav-hidden');
    } else {
        // Scroll hacia arriba
        navbar.classList.remove('nav-hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evita valores negativos
}, false);
