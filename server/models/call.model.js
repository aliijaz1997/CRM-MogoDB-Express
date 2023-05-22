const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const callLogSchema = new Schema({
  serialNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  duration: { type: String, required: true },
  type: { type: String, enum: ["incoming", "outgoing"], required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled", "missed"],
    default: "pending",
  },
  notes: { type: String },
  createdBy: {
    type: {
      _id: String,
      name: String,
    },
    required: true,
  },
  client: {
    type: {
      _id: String,
      name: String,
    },
    required: true,
  },
});

const Call = mongoose.model("Call", callLogSchema);

module.exports = Call;
