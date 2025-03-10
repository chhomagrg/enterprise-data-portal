const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Import path module for proper path handling
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // To generate a token for password reset

const userRoutes = require("./routes/userRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'frontend' directory
app.use("/images", express.static(path.join(__dirname, "../frontend/images")));
app.use("/data", express.static(path.join(__dirname, "../frontend/data"))); // Serve data folder for Excel File

app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);


// Create a transport using your email provider's SMTP settings
const transporter = nodemailer.createTransport({
    service: "gmail", // Example with Gmail, you can use other providers too
    auth: {
        user: "k.dayquon2@gmail.com", // Replace with your email
        pass: "@Mehki03172022", // Replace with your email password
    },
});

// POST route for password reset request
app.post("/reset-password", (req, res) => {
    const { email } = req.body;

    // Here, you would normally check if the email exists in your database
    // For example: User.find({ email }) -> Assuming that exists, we'll proceed

    // Generate a random token for the password reset
    const token = crypto.randomBytes(20).toString("hex");

    // Set an expiration time for the token (e.g., 1 hour)
    const expirationTime = Date.now() + 3600000; // 1 hour

    // Normally, you would save this token and expiration time in the user's record in the database.
    // For example, User.updateOne({ email }, { resetToken: token, resetTokenExpiration: expirationTime });

    // Compose the password reset email
    const resetLink = `http://your-website.com/reset-password/${token}`; // Replace with your reset password page URL

    const mailOptions = {
        from: "k.dayquon2@gmail.com", // Sender address
        to: email, // Receiver's email address
        subject: "Password Reset Request",
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
            return res.status(500).json({ message: "Error sending email. Please try again later." });
        } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Password reset instructions sent to your email." });
        }
    });
});

// POST route for handling password reset form submission
app.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Here, you would normally find the user by the token and check if the token is valid and not expired
    // For example, User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    
    // Simulate checking the token expiration and validity
    if (!token || !newPassword) {
        return res.status(400).json({ message: "Invalid request. Token or new password missing." });
    }

    // Normally, update the user's password in the database here
    // User.updateOne({ resetToken: token }, { password: newPassword, $unset: { resetToken: 1, resetTokenExpiration: 1 } });

    // For this example, let's assume the password was successfully updated
    return res.status(200).json({ message: "Password has been successfully reset." });
});

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/max_energy", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));
