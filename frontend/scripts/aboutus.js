document.querySelectorAll('.mission-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const heading = item.querySelector('h3');
        heading.style.transform = 'scale(1.1)';  // Slight scale effect on heading
    });

    item.addEventListener('mouseleave', () => {
        const heading = item.querySelector('h3');
        heading.style.transform = 'scale(1)';  // Reset scale when hover ends
    });
});

// Navbar active link highlighting
const navLinks = document.querySelectorAll('.nav-links li a');
const currentPage = window.location.pathname.split('/').pop().toLowerCase();

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop().toLowerCase();
    if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

