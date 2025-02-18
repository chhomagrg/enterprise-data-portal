document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get values from the registration form
    const name = document.getElementById("name").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    // Reset the error message before submitting
    const errorMessageElement = document.querySelector('.error-text');
    errorMessageElement.textContent = ""; // Clear any previous error message
    errorMessageElement.classList.add("hidden"); // Hide error message

    try {
        const response = await fetch("http://localhost:5000/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            
            // Clear the form fields if registration successful
            document.getElementById("registrationForm").reset();
            
            // Hide registration modal and show login modal on success
            alert("Registration successful! Redirecting to login...");
            document.getElementById("registerModal").style.display = "none"; // Hide modal
            document.getElementById("authModal").style.display = "block"; // Show login modal
        } else {
            // Show error message if registration failed
            errorMessageElement.textContent = data.message || "Registration failed.";
            errorMessageElement.classList.remove("hidden");

            // Clear the form fields if there's an error
            document.getElementById("registrationForm").reset();

            // Hide error message after 3 seconds
            setTimeout(() => {
                errorMessageElement.classList.add("hidden");
            }, 3000);
        }
    } catch (error) {
        console.error("Error:", error);
        // Show a general error message in case of an unexpected error
        errorMessageElement.textContent = "An error occurred. Please try again.";
        errorMessageElement.classList.remove("hidden");

        // Clear the form fields after an error
        document.getElementById("registrationForm").reset();

        // Hide error message after 3 seconds
        setTimeout(() => {
            errorMessageElement.classList.add("hidden");
        }, 3000);
    }
});
