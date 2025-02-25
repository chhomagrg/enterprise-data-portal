const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    // Validate JWT token format
    if (token.length < 10) { // Basic validation for token length
        return res.status(403).json({ message: "Invalid token format." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key"); // Use secret from env
        req.user = decoded; // Attach user info to the request object
        next();
    } catch (error) {
        console.error("JWT verification failed:", error);
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;

