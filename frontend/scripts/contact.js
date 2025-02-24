document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const successMessage = document.createElement("div");


    successMessage.style.display = "none";
    successMessage.style.padding = "10px";
    successMessage.style.backgroundColor = "#4CAF50";
    successMessage.style.color = "white";
    successMessage.style.marginTop = "10px";
    successMessage.style.textAlign = "center";
    successMessage.textContent = "Your message has been sent successfully!";
    form.parentElement.appendChild(successMessage);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        form.style.display = "none";

        successMessage.style.display = "block";

        setTimeout(function () {
            form.reset();
            form.style.display = "block";
            successMessage.style.display = "none";
        }, 5000);
    });
});