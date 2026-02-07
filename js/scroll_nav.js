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

document.querySelectorAll('.brand-icon, .console-icon').forEach(button => {
    button.addEventListener('click', () => {
        const mainNav = document.querySelector('.main-nav');
        mainNav.classList.remove('compact');
        // Opcional: hacer scroll suave hacia arriba para que se vea bien
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
