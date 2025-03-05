// Handle showing and hiding the login and password reset forms
const showPasswordReset = document.getElementById('showPasswordReset');
const showLogin = document.getElementById('showLogin');
const authModal = document.getElementById('authModal');
const passwordResetModal = document.getElementById('passwordResetModal');
const closeResetModal = passwordResetModal.querySelector('.close');

// When the user clicks the "Forgot Password?" link
if (showPasswordReset) {
    showPasswordReset.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        authModal.style.display = 'none'; // Hide the login modal
        passwordResetModal.style.display = 'block'; // Show the password reset modal
    });
}

// When the user clicks "Back to Login" inside the password reset modal
if (showLogin) {
    showLogin.addEventListener('click', function(event) {
        event.preventDefault();
        passwordResetModal.style.display = 'none'; // Hide the password reset modal
        authModal.style.display = 'block'; // Show the login modal
    });
}

// Close the password reset modal when the close button is clicked
if (closeResetModal) {
    closeResetModal.addEventListener('click', function() {
        passwordResetModal.style.display = 'none'; // Close the reset modal
        authModal.style.display = 'block'; // Show the login modal
    });
}

// Close the login modal when clicking the close button
const closeAuthModal = authModal.querySelector('.close');
if (closeAuthModal) {
    closeAuthModal.addEventListener('click', function() {
        authModal.style.display = 'none';
    });
}

// Close the modals if clicked outside
window.addEventListener('click', function(event) {
    if (event.target === authModal) {
        authModal.style.display = 'none';
    }
    if (event.target === passwordResetModal) {
        passwordResetModal.style.display = 'none';
    }
});
