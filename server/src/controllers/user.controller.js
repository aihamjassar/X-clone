const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");

const Notification = require("../models/notification.model");
const User = require("../models/user.model");

exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const me = await User.findById(userId).select("following").lean();
    if (!me) {
      return res.status(404).json({ error: "User not found" });
    }

    const usersFollowedByMe = me?.following ?? [];

    const suggestedUsers = await User.aggregate([
      {
        $match: {
          _id: { $nin: [me._id, ...usersFollowedByMe] },
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          profileImg: 1,
        },
      },
      { $sample: { size: 5 } },
      {
        $sort: { username: 1 },
      },
    ]);

    res.status(200).json(suggestedUsers);
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
    const {
      username,
      email,
      fullName,
      bio,
      link,
      currentPassword,
      newPassword,
    } = req.body;
    let { profileImg, coverImg } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && username !== user.username) {
        return res.status(400).json({ error: "Username is already taken" });
      }
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail && email !== user.email) {
        return res.status(400).json({ error: "Email is already taken" });
      }
    }

    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    let hashedPassword;
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        console.log({ profileImg });
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0],
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0],
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    const updatedUser = await User.findOneAndUpdate(user._id, {
      username: username || user.username,
      fullName: fullName || user.fullName,
      email: email || user.email,
      password: hashedPassword || user.password,
      bio: bio || user.bio,
      link: link || user.link,
      profileImg: profileImg || user.profileImg,
      coverImg: coverImg || user.coverImg,
    }).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateUserProfile controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
