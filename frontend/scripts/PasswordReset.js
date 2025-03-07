// Show the password reset modal when "Forgot Password?" is clicked
document.getElementById('forgot-password-link').addEventListener('click', function () {
    document.getElementById('passwordResetModal').style.display = 'block';
  });
  
  // Close the modal when clicking on the close button (x)
  function closeModal() {
    document.getElementById('passwordResetModal').style.display = 'none';
  }
  
  // Toggle between login form and password reset form
  function toggleLoginForm() {
    document.getElementById('passwordResetModal').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';  // Assuming you have a login form with id="loginForm"
  }
  
  // Handle the password reset form submission
  document.getElementById('resetSubmitBtn').addEventListener('click', async function () {
    const email = document.getElementById('resetEmail').value;
    
    // Validate if the email is entered
    if (!email) {
      alert('Please enter your email.');
      return;
    }
  
    // Clear any previous messages
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
  
    try {
      // Send a POST request to the backend to request a password reset
      const response = await fetch('/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Show success message
        document.getElementById('successMessage').style.display = 'block';
      } else {
        // Show error message
        document.getElementById('errorMessage').style.display = 'block';
      }
    } catch (error) {
      // Handle network or server errors
      document.getElementById('errorMessage').style.display = 'block';
    }
  });
  