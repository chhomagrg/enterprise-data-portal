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
    const backToLogin = document.getElementById("backToLogin"); 

    // Side nav bar
    const token = localStorage.getItem("token");
    const sidebar = document.getElementById("sidebar");
    const usernameElement = document.getElementById("sidebarUsername");
    const avatarElement = document.getElementById("sidebarAvatar");
    const logoutBtnSidebar = document.getElementById("logoutBtnSidebar");
    const themeToggle = document.getElementById("themeToggle");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const calendarSection = document.querySelector(".calendar-section");
    const sidebarIcon = document.getElementById("sidebarIcon");

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
            if (sidebar) sidebar.classList.add("show");
            if (sidebar) sidebar.style.display = "flex"; // Ensure sidebar appears

            if (sidebarToggle) sidebarToggle.style.display = "block";
            if (sidebar) {
                sidebar.style.display = "flex";
            }
    
            await loadUserProfile(token);
    
            setTimeout(() => {
                initializeCalendar();
            }, 500);
            

        } else {
            // Hide profile section and logout button, show login button
            if (loginBtn) loginBtn.style.display = "inline-block";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (dataLink) dataLink.href = "#"; // Restrict access if not logged in
            if (profileSection) profileSection.style.display = "none"; // Hide profile section
            if (profileLink) profileLink.style.display = "none"; // Hide profile icon

            /// Hide sidebar completely
            if (sidebar) sidebar.classList.remove("show");
            if (sidebar) sidebar.style.display = "none";
            if (sidebarToggle) sidebarToggle.style.display = "none";
            if (sidebar) sidebar.style.display = "none";
        
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
    } else {
        sidebar.classList.remove("collapsed");
    }

    // Toggle sidebar on click
    sidebarToggle.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");

        if (sidebar.classList.contains("collapsed")) {
            localStorage.setItem("sidebarState", "collapsed"); // Store state         
        } else { 
            localStorage.setItem("sidebarState", "expanded"); // Store state
        }


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

    const logo = document.getElementById("navbarLogo");
    const sidebarLogo = document.getElementById("sidebarLogo");
    

    let savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode"); // Ensures default light mode
    }
    // Update the logo based on the initial theme
    updateLogo();

    // Dark Mode Toggle
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
                themeToggle.checked = true; // Toggle ON if dark mode is stored
            } else {
                localStorage.removeItem("theme");
            }

            updateLogo();
        });
    }

    // Function to update the logo based on theme
    function updateLogo() {
        if (document.body.classList.contains("dark-mode")) {
            logo.src = "images/logo-dark.png";  // Set Dark Mode Logo for navbar
            sidebarLogo.src = "images/logo-dark-2.png"; // Set Dark Mode logo for sidebar
        } else {
            logo.src = "images/logo.png"; // Set Light Mode Logo for navbar
            sidebarLogo.src = "images/logo-2.png" //Set lightmode logo for sidebar
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

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("theme"); // Reset theme

            // Reset theme to default (light mode)
            document.body.classList.remove("dark-mode");

            // Uncheck theme toggle switch
            if (themeToggle) {
                themeToggle.checked = false;
            }

            alert("Logged out successfully!");

            checkAuthStatus();
            window.location.href = "index.html"; // Redirect to homepage
        });
    }

    // Password Reset Handling (FORGOT PASSWORD LINK)
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function (event) {
            event.preventDefault();
            resetPasswordModal.style.display = "block"; // Show the reset password modal
        });
    }

    // Handle Password Reset Submit
    if (resetSubmitBtn) {
        resetSubmitBtn.addEventListener("click", async function (event) {
            event.preventDefault();

            const email = resetEmailInput.value;

            try {
                const response = await fetch("http://localhost:5000/api/users/reset-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    resetMessage.textContent = data.message || "Password reset email sent.";
                    resetMessage.classList.add("success");
                    resetMessage.classList.remove("error");
                } else {
                    resetMessage.textContent = data.message || "Error sending password reset email.";
                    resetMessage.classList.add("error");
                    resetMessage.classList.remove("success");
                }

                resetMessage.style.display = "block";
            } catch (error) {
                resetMessage.textContent = "An error occurred. Please try again.";
                resetMessage.classList.add("error");
                resetMessage.classList.remove("success");
                resetMessage.style.display = "block";
            }
        });
    }

    // Close Reset Password Modal
    if (closeResetPasswordModal) {
        closeResetPasswordModal.addEventListener("click", function () {
            resetPasswordModal.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target === resetPasswordModal) {
                resetPasswordModal.style.display = "none";
            }
        });
    }
    if (backToLogin) {
        backToLogin.addEventListener("click", function (event) {
            event.preventDefault();
            authModal.style.display = "block"; // Show login modal
        });
    }

    
    async function initializeCalendar() {
        var calendarEl = document.getElementById("sidebarCalendar");

        if (!calendarEl) {
            console.error("Calendar element not found! Retrying in 500ms...");
            setTimeout(initializeCalendar, 500);
            return;
        }
        

        async function fetchHolidays() {
            try {
                let response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2025/US");

                if (!response.ok) {
                    console.error("API Error:", response.status, response.statusText);
                    return [];
                }

                let holidays = await response.json();

                return holidays.map(holiday => ({
                    title: holiday.localName,
                    start: holiday.date,
                    backgroundColor: "#ffcc00",
                    extendedProps: { fullName: holiday.localName }
                }));
            } catch (error) {
                console.error("Error fetching holidays:", error);
                return [];
            }
        }

        let holidayEvents = await fetchHolidays();

        // Clear previous calendar content before rendering
        calendarEl.innerHTML = "";

        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            height: 250,
            aspectRatio: 2.5,
            nowIndicator: true,
            initialDate: new Date(),
            headerToolbar: {
                start: "prev",
                center: "title",
                end: "next"
            },
            events: holidayEvents,
            eventClick: function (info) {
                alert("Holiday: " + info.event.extendedProps.fullName);
            }
        });
        // Render the calendar
        
        calendar.render();
    }

    // Run the checkAuthStatus function on page load
    checkAuthStatus();
    

});