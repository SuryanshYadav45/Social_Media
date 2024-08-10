const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  type: {
    type: String,
    enum: ["friendRequest", "like", "comment", "other"],
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
  },
  status: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationModel = new mongoose.model(
  "Notification",
  NotificationSchema
);

module.exports = NotificationModel;
