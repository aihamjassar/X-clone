const express = require("express");
const {
  checkAuth,
  signup,
  login,
  logout,
} = require("../controllers/auth.controller");
const { protectRoute } = require("../middlewares/protectRoute");

const router = express.Router();

router.get("/check-auth", protectRoute, checkAuth);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
