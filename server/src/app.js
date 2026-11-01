const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const notificationRoutes = require("./routes/notification.route");
const { default: mongoose } = require("mongoose");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => res.status(200).send("OK"));

app.get("/ready", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).send("OK");
  } catch (error) {
    res.status(503).send("DB unavailable");
  }
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notification", notificationRoutes);

module.exports = app;
