const Notification = require("../models/notification.model");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getNotifications controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(204).end();
  } catch (error) {
    console.error("Error in deleteNotifications controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this notification" });
    }

    await Notification.deleteOne({ _id: notificationId });
    res.status(204).end();
  } catch (error) {
    console.error("Error in deleteNotification controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
