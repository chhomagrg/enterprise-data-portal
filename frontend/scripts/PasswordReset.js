document.addEventListener("DOMContentLoaded", function () {
    // Selecting elements
    const resetForm = document.getElementById("resetPasswordForm");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const resetSubmitBtn = document.getElementById("resetSubmitBtn");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");
    const backToLoginLink = document.querySelector(".back-to-login a");
    const authModal = document.getElementById("authModal");

    if (!resetForm || !newPasswordInput || !confirmPasswordInput || !resetSubmitBtn) {
        console.error(" Error: One or more input fields/buttons not found!");
        return;
    }

    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        console.error("No reset token found in URL!");
        errorMessage.textContent = "Invalid or missing reset token.";
        errorMessage.style.display = "block";
        return;
    }

    resetForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validate passwords
        if (!newPassword || !confirmPassword) {
            errorMessage.textContent = "Both fields are required!";
            errorMessage.style.display = "block";
            return;
        }

        if (newPassword.length < 6) {
            errorMessage.textContent = "Password must be at least 6 characters!";
            errorMessage.style.display = "block";
            return;
        }

        if (newPassword !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match!";
            errorMessage.style.display = "block";
            return;
        }

        try {
            // Send password reset request
            const response = await fetch(`http://localhost:5000/api/users/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                successMessage.textContent = data.message || "Password reset successfully!";
                successMessage.style.display = "block";
                errorMessage.style.display = "none";

                // Ensure user is NOT logged in automatically
                localStorage.removeItem("token"); 

            } else {
                errorMessage.textContent = data.message || "Error resetting password.";
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Password reset error:", error);
            errorMessage.textContent = "An error occurred. Please try again.";
            errorMessage.style.display = "block";
        }
    });

    // Open Login Modal when clicking "Back to Login"
    if (backToLoginLink) {
        backToLoginLink.addEventListener("click", function (event) {
            event.preventDefault();
            
            if (authModal) {
                authModal.style.display = "block"; // Show the login modal
            }
        });
    }
});
