const navbar = document.querySelector('.main-nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Solo expandir cuando estamos realmente arriba (inicio de página)
    if (scrollTop <= 10) {
        navbar.classList.remove('compact');
    } else {
        // En cualquier otro punto de la página, se mantiene compacta
        navbar.classList.add('compact');
    }
}, false);
