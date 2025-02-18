const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Ensure you use environment variables for security

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

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

/**
 * @route   GET /api/users/profile
 * @desc    Get logged-in user profile
 * @access  Private (Requires JWT)
 */
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
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

// EXPORT THE ROUTER
module.exports = router;
