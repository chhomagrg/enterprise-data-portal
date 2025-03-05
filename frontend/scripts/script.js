document.addEventListener('DOMContentLoaded', function () {
    // Slider functionality
    const slider = document.querySelector('.slider .list');
    const slides = document.querySelectorAll('.slider .item');
    const dots = document.querySelectorAll('.dots li');
    let currentIndex = 0;
    const totalSlides = slides.length;
    let interval;

    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }

    function startAutoSlide() {
        interval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(interval);
    }

    startAutoSlide();

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = index;
            showSlide(currentIndex);
            startAutoSlide();
        });
    });

    document.getElementById('prev').addEventListener('click', () => {
        stopAutoSlide();
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
        startAutoSlide();
    });

    document.getElementById('next').addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
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

    // Hamburger Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active'); // For animation
        });
    }
});


