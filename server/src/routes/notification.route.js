const express = require("express");

const { protectRoute } = require("../middlewares/protectRoute");
const {
  getNotifications,
  deleteNotifications,
  deleteNotification,
} = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotification);

module.exports = router;
