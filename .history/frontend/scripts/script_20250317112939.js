document.addEventListener('DOMContentLoaded', function () {
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

// Search Bar JavaScript 

    // Function to handle the search action
    document.getElementById('searchBtn').addEventListener('click', function() {
        const query = document.getElementById('searchInput').value;
        if (query) {
            // Redirect to search results page with query (you can replace the URL)
            window.location.href = 'search-results.html?q=' + encodeURIComponent(query);
        }
    });

    // Optional: Enable pressing Enter to trigger the search
    document.getElementById('searchInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('searchBtn').click();
        }
    });



    














