// Programmers: Sachorra, , , , ,
// Date: 2/04/2024

document.addEventListener("DOMContentLoaded", function () {
    // **Highlight Active Navigation Link**
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

    // **Slider Functionality**
    let list = document.querySelector('.slider .list');
    let items = document.querySelectorAll('.slider .list .item');
    let dots = document.querySelectorAll('.slider .dots li');
    let prev = document.getElementById('prev');
    let next = document.getElementById('next');
    
    let active = 0;
    const lengthItems = items.length;

    // Automatic slide change every 5 seconds
    setInterval(() => {
        next.click();
    }, 5000);

    next.onclick = function () {
        active = (active + 1) % lengthItems;
        reloadSlider();
    };

    prev.onclick = function () {
        active = (active - 1 + lengthItems) % lengthItems;
        reloadSlider();
    };

    function reloadSlider() {
        let checkLeft = items[active].offsetLeft;
        list.style.left = -checkLeft + 'px';

        document.querySelector('.dots .active').classList.remove('active');
        dots[active].classList.add('active');
    }

    dots.forEach((dot, index) => {
        dot.onclick = function () {
            active = index;
            reloadSlider();
        };
    });

    // **Explore & Learn More Buttons**
    const exploreBtn = document.getElementById("explore-btn");
    const learnMoreBtn = document.getElementById("learn-more-btn");
    const authModal = document.getElementById("authModal");

    if (exploreBtn) {
        exploreBtn.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default action
            const token = localStorage.getItem("token");

            if (!token) {
                authModal.classList.add("show"); // Show login modal
                document.getElementById("authForm").addEventListener("submit", function () {
                    setTimeout(() => {
                        window.location.href = "data.html";
                    }, 2000);
                });
            } else {
                window.location.href = "data.html"; // If logged in, go directly
            }
        });
    }

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener("click", function () {
            window.location.href = "aboutus.html"; // Redirects to About Us page
        });
    }

    // **Hamburger Menu for Mobile**
    const hamburger = document.querySelector('.hamburger');
    const navLinksMenu = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinksMenu.classList.toggle('active');
    });
});
document.addEventListener('scroll', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        if (item.getBoundingClientRect().top < window.innerHeight - 100) {
            item.classList.add('visible');
        }
    });
});

function showDetails(type) {
    let details = document.getElementById('details');
    switch (type) {
        case 'solar':
            details.innerHTML = 'Our solar solutions are at the forefront of innovation, providing efficient and sustainable energy.';
            break;
        case 'global':
            details.innerHTML = 'We are making a global impact by expanding our reach and promoting renewable energy worldwide.';
            break;
        case 'sustainable':
            details.innerHTML = 'Our commitment to a sustainable future is unwavering, as we continuously strive to reduce our carbon footprint.';
            break;
        default:
            details.innerHTML = '';
    }
}

