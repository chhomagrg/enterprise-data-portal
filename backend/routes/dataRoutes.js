const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// Secure route that only logged-in users can access
router.get("/protected-data", authenticateUser, (req, res) => {
    res.json({
        message: "This is protected data only accessible by logged-in users!",
        user: req.user // User details from token
    });
});

module.exports = router;

