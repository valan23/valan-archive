document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.main-nav');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 1. Lógica de la Barra (Compactar si no estamos arriba)
        if (scrollTop <= 10) {
            navbar.classList.remove('compact');
        } else {
            navbar.classList.add('compact');
        }

        // 2. Lógica del Botón (Mostrar solo si bajamos más de 400px)
        if (scrollTop > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, false);

    // 3. Acción del Botón Volver Arriba
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 4. Expandir al hacer clic en cualquier icono de filtro
    document.querySelectorAll('.brand-icon, .console-icon, .year-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (navbar.classList.contains('compact')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
});
