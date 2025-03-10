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

document.addEventListener("DOMContentLoaded", async function () {
    var calendarEl = document.getElementById("sidebarCalendar");

    // Ensure calendar element exists before proceeding
    if (!calendarEl) {
        console.error("Calendar element not found!");
        return; 
    }

    // Function to fetch public holidays from the API
    async function fetchHolidays() {
        try {
            let response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2025/US");

            if (!response.ok) {
                console.error("API Error:", response.status, response.statusText);
                return [];
            }

            let holidays = await response.json();

            return holidays.map(holiday => ({
                title: holiday.localName,
                start: holiday.date,
                backgroundColor: "#ffcc00",
                extendedProps: { fullName: holiday.localName }
            }));
        } catch (error) {
            console.error("Error fetching holidays:", error);
            return [];
        }
    }

    let holidayEvents = await fetchHolidays();

    // Ensure FullCalendar does not initialize multiple times
    if (calendarEl.innerHTML.trim() !== "") {
        calendarEl.innerHTML = ""; // Clear any existing content
    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        height: 250,
        aspectRatio: 2.5,
        nowIndicator: true,
        initialDate: new Date(),
        headerToolbar: {
            start: "prev",
            center: "title",
            end: "next"
        },
        events: holidayEvents,
        eventClick: function (info) {
            alert("Holiday: " + info.event.extendedProps.fullName);
        }
    });

    // Render the calendar inside the sidebar
    calendar.render();
});















