const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; 

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Hash password before storing in DB
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error. Please try again.", error: error.message });
    }
});

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error. Please try again.", error: error.message });
    }
});

// GET /api/users/profile
// Get the logged-in user's profile
// Access: Private (Requires JWT)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");  // Exclude password field
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);  // Send the user data (including avatar) to the frontend
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Server error. Please try again.", error: error.message });
    }
});

/**
 * @route   GET /api/users/all
 * @desc    Get all registered users (For testing purposes)
 * @access  Private (Requires JWT)
 */
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error. Please try again.", error: error.message });
    }
});


/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private (Requires JWT)
 */
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { username, name, bio, role, email, avatar } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the email is being updated and ensure the new email isn't taken
        if (email && email !== user.email) {
            //  Validate the email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic regex to check if email contains @
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Please provide a valid email address." });
            }

            // Check if email is already taken by another user
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "Email is already in use." });
            }

            // If email is valid and not taken, update it
            user.email = email;
        }

        // Only validate and update avatar if it's provided
        if (avatar) {
            const validAvatars = [
                'users-1.svg', 'users-2.svg', 'users-3.svg', 
                'users-4.svg', 'users-5.svg', 'users-6.svg',
                'users-7.svg', 'users-8.svg', 'users-9.svg',
                'users-10.svg', 'users-11.svg', 'users-12.svg',
                'users-13.svg', 'users-14.svg', 'users-15.svg',
                'users-16.svg'
            ];

            if (validAvatars.includes(avatar)) {
                user.avatar = `images/avatars/${avatar}`;  // Update avatar path
            } else {
                return res.status(400).json({ message: "Invalid avatar selected." });
            }
        }

        // Update other fields if they are provided
        if (name) user.name = name;
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (role) user.role = role;

        await user.save();

        res.json({ message: "Profile updated successfully!", user });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }

    
});




// EXPORT THE ROUTER
module.exports = router;
