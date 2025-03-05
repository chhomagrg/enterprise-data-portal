// app.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');  // For hashing passwords

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up the SMTP transporter using SendGrid's SMTP server
const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: 'apikey',  // SendGrid SMTP username (always 'apikey')
        pass: process.env.SENDGRID_API_KEY,  // Load SendGrid API key from environment variable
    },
});

// Function to generate a password reset token (JWT)
function generateResetToken(userId) {
    const payload = { userId }; // Attach user info (e.g., userId) to the payload
    const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key'; // Your secret key (store in .env)
    const options = { expiresIn: '1h' }; // Set token expiration (1 hour)

    return jwt.sign(payload, secretKey, options); // Return the generated JWT token
}

// Function to send the password reset email
function sendPasswordResetEmail(toEmail, resetToken) {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.SENDER_EMAIL,  // Use email from .env for sender's address
        to: toEmail,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Password reset email sent:', info.response);
        }
    });
}

// Route to handle password reset requests
app.post('/reset-password-request', (req, res) => {
    const { email } = req.body;

    // Look up the user by email in your database (this is just a mock user for now)
    const userId = 123; // Example userId for the user (this should be fetched from your database)
    const userEmail = 'user@example.com'; // Mock email

    // Check if the email exists in your database (use real DB lookup)
    if (email !== userEmail) {
        return res.status(400).send('Email not found');
    }

    // Generate a reset token for the user
    const resetToken = generateResetToken(userId);

    // Send the password reset email with the token
    sendPasswordResetEmail(email, resetToken);

    // Respond to the frontend
    res.status(200).send('Password reset email sent');
});

// Route to handle the password reset page (where the user submits the token)
app.post('/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token using the secret key
        console.log('Token is valid. User ID:', decoded.userId); // Log the decoded userId

        // Hash the new password
        bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
            if (err) {
                return res.status(500).send('Error hashing password');
            }

            // Here you would typically update the user's password in the database
            // Example: await User.updatePassword(decoded.userId, hashedPassword);

            res.status(200).send('Password has been reset');
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(400).send('Invalid or expired token');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
