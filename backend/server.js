const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const dataRoutes = require("./routes/dataRoutes"); // Import data routes
const authRoutes = require("./routes/authRoutes"); // Şifrə sıfırlama üçün əlavə et


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes); // Register data routes

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/max_energy", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const dataRoutes = require("./routes/dataRoutes"); // Import data routes
const authRoutes = require("./routes/authRoutes"); // Şifrə sıfırlama üçün əlavə et

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes); // Register data routes
app.use("/api/auth", authRoutes); // Yeni route-u qeydiyyatdan keçir

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/max_energy", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));


  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));

