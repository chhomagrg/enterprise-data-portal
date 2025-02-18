
document.getElementById('contact-form').addEventListener('submit', function(event) {
   
    event.preventDefault();

    document.getElementById('success-message').style.display = 'block';

    event.target.reset();
});
