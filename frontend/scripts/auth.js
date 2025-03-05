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

    // Profile section
    const profileSection = document.getElementById("profileSection");
    const profileLink = document.getElementById("profileLink");

    // Message Elements
    const loginMessage = document.getElementById("loginMessage");
    const registerMessage = document.getElementById("registerMessage");

    // Password Reset Elements
    const resetPasswordModal = document.getElementById("resetPasswordModal");
    const closeResetPasswordModal = document.getElementById("closeResetPasswordModal");
    const resetForm = document.getElementById("resetForm");
    const resetEmailInput = document.getElementById("resetEmail");
    const resetMessage = document.getElementById("resetMessage");
    const resetSubmitBtn = document.getElementById("resetSubmitBtn");

    // Side nav bar
    const token = localStorage.getItem("token");
    const sidebar = document.getElementById("sidebar");
    const usernameElement = document.getElementById("sidebarUsername");
    const avatarElement = document.getElementById("sidebarAvatar");
    const logoutBtnSidebar = document.getElementById("logoutBtnSidebar");
    const themeToggle = document.getElementById("themeToggle");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const calendarEl = document.getElementById("calendar");

    // Function to check authentication status across all pages
    function checkAuthStatus() {
        const token = localStorage.getItem("token");

        // Check if the user is logged in
        if (token) {
            // Show profile, data page and logout button, hide login button
            if (loginBtn) loginBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";
            if (dataLink) dataLink.href = "data.html"; // Allow access to data page
            if (profileSection) profileSection.style.display = "block"; // Show profile section
            if (profileLink) profileLink.style.display = "inline-block"; // Show profile icon

            // Show sidebar and hamburger menu
            if (sidebar) sidebar.style.display = "flex"; // Ensure sidebar appears
            if (sidebarToggle) sidebarToggle.style.display = "block";
            loadUserProfile(token);

        } else {
            // Hide profile section and logout button, show login button
            if (loginBtn) loginBtn.style.display = "inline-block";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (dataLink) dataLink.href = "#"; // Restrict access if not logged in
            if (profileSection) profileSection.style.display = "none"; // Hide profile section
            if (profileLink) profileLink.style.display = "none"; // Hide profile icon

            /// Hide sidebar completely
            if (sidebar) sidebar.style.display = "none";
            if (sidebarToggle) sidebarToggle.style.display = "none";
        }
    }


    // Load user profile data for sidebar
    async function loadUserProfile(token) {
        try {
            const response = await fetch("http://localhost:5000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }

            const user = await response.json();
            sidebarUsername.textContent = user.name || "User";
            sidebarAvatar.src = user.avatar || "images/default-avatar.png";
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    // Load sidebar state from localStorage
    if (localStorage.getItem("sidebarState") === "collapsed") {
        sidebar.classList.add("collapsed");
    }

    // Toggle sidebar on button click
    sidebarToggle.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");

        // Save sidebar state to localStorage
        localStorage.setItem("sidebarState", sidebar.classList.contains("collapsed") ? "collapsed" : "expanded");
    });

    

    // Handle Logout
    if (logoutBtnSidebar) {
        logoutBtnSidebar.addEventListener("click", function () {
            localStorage.removeItem("token");
            alert("Logged out successfully!");
            checkAuthStatus();
            window.location.href = "index.html";
        });
    }

    // Dark Mode Toggle
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        });
    }
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            height: "auto"
        });
        calendar.render();
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

    // Handle Login Submission (already in your code)
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

                    loginMessage.textContent = "Login successful!";
                    loginMessage.classList.add("success");
                    loginMessage.classList.remove("error");
                    loginMessage.style.display = "block";

                    setTimeout(() => {
                        authModal.style.display = "none";
                        clearInputs(authForm);
                        checkAuthStatus();
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

    // Handle Logout (already in your code)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");

            alert("Logged out successfully!");

            checkAuthStatus();
            window.location.href = "index.html"; // Redirect to homepage
        });
    }

    // Handle Password Reset Request
    if (resetSubmitBtn) {
        resetSubmitBtn.addEventListener("click", async function (event) {
            event.preventDefault();

            const resetEmail = resetEmailInput.value;

            try {
                const response = await fetch("http://localhost:5000/api/users/password-reset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: resetEmail })
                });

                const data = await response.json();

                if (response.ok) {
                    resetMessage.textContent = "Password reset email sent! Check your inbox.";
                    resetMessage.classList.add("success");
                    resetMessage.classList.remove("error");
                    resetMessage.style.display = "block";

                    setTimeout(() => {
                        resetPasswordModal.style.display = "none";
                        clearInputs(resetForm);
                    }, 5000);
                } else {
                    resetMessage.textContent = data.message || "Error: Email not found.";
                    resetMessage.classList.add("error");
                    resetMessage.classList.remove("success");
                    resetMessage.style.display = "block";

                    setTimeout(() => {
                        resetMessage.style.display = "none";
                    }, 5000);
                }
            } catch (error) {
                resetMessage.textContent = "An error occurred. Please try again.";
                resetMessage.classList.add("error");
                resetMessage.classList.remove("success");
                resetMessage.style.display = "block";

                setTimeout(() => {
                    resetMessage.style.display = "none";
                }, 5000);
            }
        });
    }

    // Open Password Reset Modal
    const showResetPasswordBtn = document.getElementById("showResetPassword");
    if (showResetPasswordBtn) {
        showResetPasswordBtn.addEventListener("click", function (event) {
            event.preventDefault();
            authModal.style.display = "none";
            resetPasswordModal.style.display = "block";
        });
    }

    // Close Password Reset Modal
    if (closeResetPasswordModal) {
        closeResetPasswordModal.addEventListener("click", function () {
            resetPasswordModal.style.display = "none";
            clearInputs(resetForm);
        });

        window.addEventListener("click", function (event) {
            if (event.target === resetPasswordModal) {
                resetPasswordModal.style.display = "none";
                clearInputs(resetForm);
            }
        });
    }

    // Run the checkAuthStatus function on page load
    checkAuthStatus();
});

