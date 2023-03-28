const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  description: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seen: { type: Boolean, default: false },
});

const User = mongoose.model("Notification", notificationSchema);

module.exports = User;
