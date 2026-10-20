const Notification = require("../models/notification.model");
const User = require("../models/user.model");

exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error in getSuggestedUsers controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (!userToModify || !currentUser)
      return res.status(404).json({ error: "User not found" });

    if (id === req.user._id.toString())
      return res.status(400).json({ error: "You can't follow yourself" });

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      //   Send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: currentUser._id,
        to: userToModify._id,
      });
      await newNotification.save();
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error("Error in followUnfollowUser controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error in updateUserProfile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
