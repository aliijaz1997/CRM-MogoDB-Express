const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const callLogSchema = new Schema({
  createdAt: { type: Date, default: Date.now() },
  duration: { type: Number, required: true },
  type: { type: String, enum: ["incoming", "outgoing"], required: true },
  notes: { type: String },
});

const Call = mongoose.model("Call", callLogSchema);

module.exports = Call;
