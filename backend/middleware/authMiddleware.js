const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;

