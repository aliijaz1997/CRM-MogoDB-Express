const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  description: { type: String, required: true },
});

const User = mongoose.model("Notification", notificationSchema);

module.exports = User;
