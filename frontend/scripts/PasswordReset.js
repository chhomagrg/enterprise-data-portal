document.addEventListener("DOMContentLoaded", function () {
  // Password Reset Elements
  const resetPasswordModal = document.getElementById("resetPasswordModal");
  const resetSubmitBtn = document.getElementById("resetSubmitBtn");
  const resetEmailInput = document.getElementById("resetEmail");
  const resetMessage = document.getElementById("resetMessage");

  // Forgot Password Link
  const forgotPasswordLink = document.getElementById("forgot-password-link");

  // If the forgot password link is clicked, show the reset password modal
  if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent default behavior (e.g., navigating)
          resetPasswordModal.style.display = "block";  // Show the reset password modal
      });
  }

  // Close the password reset modal when clicking outside the modal or on the close button
  const closeResetPasswordModal = document.getElementById("closeResetPasswordModal");
  if (closeResetPasswordModal) {
      closeResetPasswordModal.addEventListener("click", function () {
          resetPasswordModal.style.display = "none"; // Hide modal
      });

      window.addEventListener("click", function (event) {
          if (event.target === resetPasswordModal) {
              resetPasswordModal.style.display = "none"; // Hide modal
          }
      });
  }

  // Handle Password Reset Submission
  if (resetSubmitBtn) {
      resetSubmitBtn.addEventListener("click", async function (event) {
          event.preventDefault(); // Prevent form from submitting the default way

          const email = resetEmailInput.value.trim(); // Get the email value from the input field

          // Basic email validation
          if (!email) {
              resetMessage.textContent = "Please enter a valid email address.";
              resetMessage.classList.add("error");
              resetMessage.classList.remove("success");
              resetMessage.style.display = "block";
              return;
          }

          try {
              // Send the email for password reset to the backend
              const response = await fetch("http://localhost:5000/reset-password", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ email }) // Send email in request body
              });

              const data = await response.json(); // Parse response as JSON

              if (response.ok) {
                  // Success response handling
                  resetMessage.textContent = data.message || "Password reset email sent successfully!";
                  resetMessage.classList.add("success");
                  resetMessage.classList.remove("error");
                  resetMessage.style.display = "block";

                  // Optionally, clear the input after successful submission
                  resetEmailInput.value = "";
              } else {
                  // Error response handling
                  resetMessage.textContent = data.message || "Error sending password reset email.";
                  resetMessage.classList.add("error");
                  resetMessage.classList.remove("success");
                  resetMessage.style.display = "block";
              }
          } catch (error) {
              // Handle network or other unexpected errors
              resetMessage.textContent = "An error occurred. Please try again.";
              resetMessage.classList.add("error");
              resetMessage.classList.remove("success");
              resetMessage.style.display = "block";
          }
      });
  }
});
