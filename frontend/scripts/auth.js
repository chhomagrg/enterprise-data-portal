document.addEventListener("DOMContentLoaded", function () {
    // Buttons & Elements
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const authModal = document.getElementById("authModal");
    const registerModal = document.getElementById("registerModal");
    const closeLoginModal = document.querySelector("#authModal .close");
    const closeRegisterModal = document.getElementById("closeRegister");
    const authForm = document.getElementById("authForm");
    const registrationForm = document.getElementById("registrationForm");
    const dataLink = document.getElementById("dataLink");
    const showRegisterBtn = document.getElementById("showRegister");
    const showLoginBtn = document.getElementById("showLogin");

    // Message Elements
    const loginMessage = document.getElementById("loginMessage");
    const registerMessage = document.getElementById("registerMessage");

    // Function to check authentication status across all pages
    function checkAuthStatus() {
        const token = localStorage.getItem("token");

        if (token) {
            if (loginBtn) loginBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";
            if (dataLink) dataLink.href = "data.html"; // Allow access to data page
        } else {
            if (loginBtn) loginBtn.style.display = "inline-block";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (dataLink) dataLink.href = "#"; // Restrict access if not logged in
        }
    }

    // Function to clear input fields
    function clearInputs(form) {
        if (form) {
            form.querySelectorAll("input").forEach(input => input.value = "");
        }
    }

    // Open Login Modal when clicking the login button
    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            authModal.style.display = "block";
        });
    }

    // Open Login Modal When Clicking "Data" Tab if Not Logged In
    if (dataLink) {
        dataLink.addEventListener("click", function (event) {
            const token = localStorage.getItem("token");
            if (!token) {
                event.preventDefault(); // Stop navigation
                authModal.style.display = "block"; // Show login modal
            }
        });
    }

    // Close Login Modal
    if (closeLoginModal) {
        closeLoginModal.addEventListener("click", function () {
            authModal.style.display = "none";
            clearInputs(authForm);
        });

        window.addEventListener("click", function (event) {
            if (event.target === authModal) {
                authModal.style.display = "none";
                clearInputs(authForm);
            }
        });
    }

    // Open Registration Modal from Login Modal
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener("click", function (event) {
            event.preventDefault();
            authModal.style.display = "none";
            registerModal.style.display = "block";
        });
    }

    // Open Login Modal from Registration Modal
    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", function (event) {
            event.preventDefault();
            registerModal.style.display = "none";
            authModal.style.display = "block";
            clearInputs(registrationForm); // Clear registration form when switching
        });
    }

    // Close Registration Modal
    if (closeRegisterModal) {
        closeRegisterModal.addEventListener("click", function () {
            registerModal.style.display = "none";
            clearInputs(registrationForm);
        });

        window.addEventListener("click", function (event) {
            if (event.target === registerModal) {
                registerModal.style.display = "none";
                clearInputs(registrationForm);
            }
        });
    }

    // Handle Login Submission
    if (authForm) {
        authForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.querySelector("#authForm #email").value;
            const password = document.querySelector("#authForm #password").value;

            try {
                const response = await fetch("http://localhost:5000/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("token", data.token);

                    loginMessage.textContent = "Login successful! Redirecting...";
                    loginMessage.classList.add("success");
                    loginMessage.classList.remove("error");
                    loginMessage.style.display = "block";

                    setTimeout(() => {
                        authModal.style.display = "none";
                        clearInputs(authForm);
                        checkAuthStatus();
                        window.location.href = "data.html"; // Redirect to data page
                    }, 3000);
                } else {
                    loginMessage.textContent = data.message || "Invalid email or password.";
                    loginMessage.classList.add("error");
                    loginMessage.classList.remove("success");
                    loginMessage.style.display = "block";

                    setTimeout(() => {
                        loginMessage.style.display = "none";
                        clearInputs(authForm);
                    }, 3000);
                }
            } catch (error) {
                loginMessage.textContent = "An error occurred. Please try again.";
                loginMessage.classList.add("error");
                loginMessage.classList.remove("success");
                loginMessage.style.display = "block";

                setTimeout(() => {
                    loginMessage.style.display = "none";
                    clearInputs(authForm);
                }, 3000);
            }
        });
    }

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");

            alert("Logged out successfully!");

            checkAuthStatus();
            window.location.href = "index.html"; // Redirect to homepage
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener("submit", async function (event) {
            event.preventDefault();
    
            // Use the correct input IDs from the HTML
            const name = document.querySelector("#registrationForm #name").value;
            const email = document.querySelector("#registrationForm #registerEmail").value;
            const password = document.querySelector("#registrationForm #registerPassword").value;
    
            try {
                const response = await fetch("http://localhost:5000/api/users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })  // Send all the required data
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    registerMessage.textContent = "Registration successful! You can now log in.";
                    registerMessage.classList.add("success");
                    registerMessage.classList.remove("error");
                    registerMessage.style.display = "block";
    
                    setTimeout(() => {
                        registerModal.style.display = "none";
                        authModal.style.display = "block";
                        clearInputs(registrationForm); // Clear form fields
                    }, 2000);
                } else {
                    // Display error message for registration failure
                    registerMessage.textContent = data.message || "Registration failed. Please try again.";
                    registerMessage.classList.add("error");
                    registerMessage.classList.remove("success");
                    registerMessage.style.display = "block";
    
                    setTimeout(() => {
                        registerMessage.style.display = "none"; // Hide error message after 3 seconds
                        clearInputs(registrationForm); // Clear the form if needed
                    }, 3000); 
                }
            } catch (error) {
                registerMessage.textContent = "An error occurred. Please try again.";
                registerMessage.classList.add("error");
                registerMessage.classList.remove("success");
                registerMessage.style.display = "block";
    
                setTimeout(() => {
                    registerMessage.style.display = "none"; // Hide error message after 3 seconds
                    clearInputs(registrationForm); // clear the form 
                }, 3000);
            }
        });
    }
    



    checkAuthStatus(); // Run on page load to check auth status
});
