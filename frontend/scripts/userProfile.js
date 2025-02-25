document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Check if the token exists

    if (!token) {
        console.log("No token found, redirecting...");
        window.location.href = "index.html"; // Redirect to homepage if not logged in
    } else {
        console.log("Token found, loading profile...");
        loadUserProfile(token);
    }

    // Load the user profile data
    async function loadUserProfile(token) {
        try {
            const response = await fetch("http://localhost:5000/api/users/profile", {
                headers: { 
                    Authorization: `Bearer ${token}`  
                }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch profile, status: ${response.status}`);
            }
    
            const user = await response.json();
            console.log("User data:", user);
    
            // Populate the form fields with user data
            document.getElementById("username").value = user.username || "";
            document.getElementById("name").value = user.name || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("company").value = user.company || "";
    
        } catch (error) {
            console.error("Error fetching profile:", error);
            alert("Error fetching profile: " + error.message); // Show an error message if the fetch fails
        }
    }

    // Show the form fields as editable
    document.getElementById("updateProfileBtn").addEventListener("click", () => {
        document.getElementById("username").readOnly = false;
        document.getElementById("name").readOnly = false;
        document.getElementById("email").readOnly = false;
        document.getElementById("company").readOnly = false;
        
        document.getElementById("updateProfileBtn").style.display = "none";
        document.getElementById("saveChangesBtn").style.display = "inline-block";
    });

    // Handle saving changes
    document.getElementById("saveChangesBtn").addEventListener("click", async () => {
        const updatedData = {
            username: document.getElementById("username").value,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            company: document.getElementById("company").value,
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
            if (response.ok) {
                alert("Profile updated successfully!");
                document.getElementById("saveChangesBtn").style.display = "none";
                document.getElementById("updateProfileBtn").style.display = "inline-block";
                // Reload user profile to show updated data
                loadUserProfile(token);
            } else {
                alert("Error updating profile: " + result.message);
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    });
});
