const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true }, 
    bio: { type: String, default: "" },
    role: { type: String, default: "" },
	avatar: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

 
