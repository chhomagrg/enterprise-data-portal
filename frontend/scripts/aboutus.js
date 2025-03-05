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

// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        console.log("Hamburger and Nav Menu found!");
        hamburger.addEventListener('click', () => {
            console.log("Hamburger clicked!");
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active'); // For animation
        });
    } else {
        console.log("Hamburger or Nav Menu not found!");
    }
});
