const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String }, // 🔹 Şifrə sıfırlama tokeni üçün sahə əlavə edildi/ Added field for password reset token
    resetTokenExpiry: { type: Date } // 🔹 Field added for the duration of the token
});

module.exports = mongoose.model("User", UserSchema);

 
