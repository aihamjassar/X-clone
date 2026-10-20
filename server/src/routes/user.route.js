const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute");
const {
  getUserProfile,
  getSuggested,
  followUnfollowUser,
  updateUserProfile,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);

router.get("/suggested", protectRoute, getSuggested);

router.post("/follow/:id", protectRoute, followUnfollowUser);

router.put("/update", protectRoute, updateUserProfile);

module.exports = router;
