const cloudinary = require("cloudinary").v2;

const User = require("../models/user.model");
const Post = require("../models/post.model");
const Notification = require("../models/notification.model");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate([
        { path: "user", select: "-password" },
        { path: "comments.user", select: "-password" },
      ]);

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    }).populate([
      { path: "user", select: "-password" },
      { path: "comments.user", select: "-password" },
    ]);

    res.status(200).json(likedPosts);
  } catch (error) {
    console.error("Error in getLikedPosts controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate([
        { path: "user", select: "-password" },
        { path: "comments.user", select: "-password" },
      ]);

    res.status(200).json(feedPosts);
  } catch (error) {
    console.error("Error in getFollowingPosts controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate([
        { path: "user", select: "-password" },
        { path: "comments.user", select: "-password" },
      ]);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getUserPosts controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { text } = req?.body;
    let { img } = req?.body;

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Post must be have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secret_url;
    }

    const post = new Post({
      user: userId,
      text,
      img,
    });
    const newPost = await Post.create(post);

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );

      res.status(200).json(updatedLikes);
    } else {
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

      const newNotification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await Notification.create(newNotification);
      post.likes.push(userId);

      res.status(200).json(post.likes);
    }
  } catch (error) {
    console.error("Error in likeUnlikePost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in commentOnPost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Error in deletePost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
