const bcrypt = require("bcryptjs");
const { generateTokenAndSetCookie } = require("../utils/generateToken");
const User = require("../models/user.model");

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findOne(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      const {
        _id,
        fullName,
        username,
        email,
        bio,
        link,
        profileImg,
        coverImg,
        followers,
        following,
      } = await User.create(newUser);

      res.status(201).json({
        _id,
        fullName,
        username,
        email,
        bio,
        link,
        profileImg,
        coverImg,
        followers,
        following,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in singup controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    const isCorrectPassword = await bcrypt.compare(
      password,
      user?.password || "",
    );

    if (!user || !isCorrectPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      bio: user.bio,
      link: user.link,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
