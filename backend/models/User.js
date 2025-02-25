const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true }, // Optional username
    bio: { type: String, default: "" },
    company: { type: String, default: "" },
    profilePicture: { type: String, default: "images/avatar.jpg" } // Default avatar
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

 
