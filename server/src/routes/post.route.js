const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute");
const {
  getAllPosts,
  createPost,
  likeUnlikePost,
  commentOnPost,
  deletePost,
} = require("../controllers/post.controller");

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

module.exports = router;
