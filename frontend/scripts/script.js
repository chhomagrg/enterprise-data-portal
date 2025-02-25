document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider .list');
    const slides = document.querySelectorAll('.slider .item');
    const dots = document.querySelectorAll('.dots li');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }

    setInterval(nextSlide, 5000);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
    });

    document.getElementById('next').addEventListener('click', () => {
        nextSlide();
    });
});