const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

module.exports = app;
