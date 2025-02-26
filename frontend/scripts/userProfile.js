document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("Token not found");
    } else {
        loadUserProfile(token);
    }

    // Load the user profile data
    async function loadUserProfile(token) {
        try {
            const response = await fetch("http://localhost:5000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch profile, status: ${response.status}`);
            }

            const user = await response.json();
            document.getElementById("username").value = user.username || "";
            document.getElementById("name").value = user.name || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("role").value = user.role || "";
            document.getElementById("bio").value = user.bio || "";

            // Set the fields back to readonly initially
            setReadOnly(true);

            // Set the avatar preview based on the user data
            if (user.avatar) {
                document.querySelector('.avatar-preview img').src = user.avatar;
            }

        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    // Set form fields as read-only or editable
    function setReadOnly(isReadOnly) {
        document.getElementById("username").readOnly = isReadOnly;
        document.getElementById("name").readOnly = isReadOnly;
        document.getElementById("email").readOnly = isReadOnly;
        document.getElementById("role").readOnly = isReadOnly;
        document.getElementById("bio").readOnly = isReadOnly;
    }

    // Show the form fields as editable when 'Update Profile' is clicked
    document.getElementById("updateProfileBtn").addEventListener("click", () => {
        setReadOnly(false); // Make fields editable

        // Hide the Update Profile button and show Save Changes button
        document.getElementById("updateProfileBtn").style.display = "none";
        document.getElementById("saveChangesBtn").style.display = "inline-block";

        // Show the "Choose Avatar" option
        document.getElementById("chooseAvatarBtn").style.display = "inline-block";  
    });

    let selectedAvatar = '';

    // Function to handle avatar selection
    function selectAvatar(avatar) {
        selectedAvatar = avatar;  
        document.querySelector('.avatar-preview img').src = `http://localhost:5000/images/avatars/${selectedAvatar}`; 
    }

    // Function to toggle avatar options visibility
    function toggleAvatarOptions() {
        const avatarOptions = document.getElementById("avatar-options");
        avatarOptions.style.display = (avatarOptions.style.display === "none" || avatarOptions.style.display === "") ? "block" : "none";  // Toggle visibility
    }

    // Handle saving changes to the profile
    document.getElementById("saveChangesBtn").addEventListener("click", async () => {
        const updatedData = {
            username: document.getElementById("username").value,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            role: document.getElementById("role").value,
            bio: document.getElementById("bio").value,
            avatar: selectedAvatar || null, //send null if no avatar is selected
        };

        try {
            const response = await fetch("http://localhost:5000/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();

            // Show message on success or failure
            const messageContainer = document.getElementById("message-container");
            const messageText = document.getElementById("message-text");

            if (response.ok) {
                messageText.classList.add("alert-success");
                messageText.classList.remove("alert-danger");
                messageText.textContent = result.message || "Profile updated successfully!";
            } else {
                messageText.classList.add("alert-danger");
                messageText.classList.remove("alert-success");
                messageText.textContent = result.message || "Error updating profile.";
            }

            // Show the message container
            messageContainer.style.display = "block";

            // Hide the message after 5 seconds
            setTimeout(() => {
                messageContainer.style.display = "none";
            }, 5000);

            // Hide the Save Changes button and show the Update Profile button
            document.getElementById("saveChangesBtn").style.display = "none";
            document.getElementById("updateProfileBtn").style.display = "inline-block";

            // Hide avatar options and "Choose Avatar" button
            document.getElementById("avatar-options").style.display = "none";
            document.getElementById("chooseAvatarBtn").style.display = "none";

            // Set the form fields back to readonly after saving
            setReadOnly(true);

            // Reload user profile to show updated data
            loadUserProfile(token);
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    });

    document.getElementById("chooseAvatarBtn").addEventListener("click", toggleAvatarOptions);

    // Expose the selectAvatar function to the global scope for avatar selection
    window.selectAvatar = selectAvatar;
});
