const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["follow", "like"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true },
);

const Notification = model("notification", notificationSchema);

module.exports = Notification;
