
const faqItems = document.querySelectorAll('.faq-item');
const categoryButtons = document.querySelectorAll('.category-btn');

 window.addEventListener("load", function() {
    const faqDescription = document.querySelector(".faq-description");
    faqDescription.classList.add("show");
});
 document.addEventListener("DOMContentLoaded", function() {
   
    setTimeout(function() {
        const faqDescription = document.querySelector(".faq-description");
        faqDescription.classList.add("show"); 
    }, 500); 

    
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        item.classList.add("show"); 
    });
});

function filterFAQ(category) {
  
    faqItems.forEach((item) => {
        const questionCategory = item.classList.contains(category) || category === 'all';
        if (questionCategory) {
            item.classList.remove('fade-out');
            item.classList.add('show');
        } else {
            item.classList.remove('show');
            item.classList.add('fade-out');
        }
    });

    categoryButtons.forEach((btn) => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function searchFAQ() {
    const searchQuery = document.getElementById('faqSearchInput').value.toLowerCase();
    faqItems.forEach((item) => {
        const questionText = item.querySelector('.question').textContent.toLowerCase();
        const answerText = item.querySelector('.answer').textContent.toLowerCase();
        if (questionText.includes(searchQuery) || answerText.includes(searchQuery)) {
            item.classList.remove('fade-out');
            item.classList.add('show');
        } else {
            item.classList.remove('show');
            item.classList.add('fade-out');
        }
    });
}

categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        filterFAQ(category);
    });
});

filterFAQ('all');

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
                 
 
     
