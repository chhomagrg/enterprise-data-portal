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
