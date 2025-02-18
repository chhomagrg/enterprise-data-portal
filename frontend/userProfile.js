document.addEventListener("DOMContentLoaded", function () {
    const userDataContainer = document.getElementById("user-data");
    const editProfileForm = document.getElementById("edit-profile-form");
    const successMessage = document.getElementById("success-message");

    // Function to fetch user data
    function fetchUserData() {
        fetch("https://api.example.com/user") // Replace with your API endpoint
            .then(response => response.json())
            .then(data => {
                displayUserData(data);
                populateEditForm(data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                userDataContainer.innerHTML = "<p>Error fetching user data.</p>";
            });
    }

    // Function to display user data
    function displayUserData(data) {
        userDataContainer.innerHTML = `
            <p>Full Name: ${data.fullName}</p>
            <p>Email: ${data.email}</p>
        `;
    }

    // Function to populate edit form with user data
    function populateEditForm(data) {
        document.getElementById("full-name").value = data.fullName;
        document.getElementById("email").value = data.email;
    }

    // Function to handle form submission
    editProfileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedData = {
            fullName: document.getElementById("full-name").value,
            email: document.getElementById("email").value
        };

        fetch("https://api.example.com/user", { // Replace with your API endpoint
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            displayUserData(data);
            successMessage.classList.remove("hidden");
            setTimeout(() => {
                successMessage.classList.add("hidden");
            }, 3000);
        })
        .catch(error => {
            console.error("Error updating user data:", error);
        });
    });

    // Fetch user data on page load
    fetchUserData();
});