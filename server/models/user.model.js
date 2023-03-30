const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ["client", "admin", "manager", "staff"],
    default: "client",
  },
  addedBy: {
    type: {
      name: String,
      role: String,
    },
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  serialNumber: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
