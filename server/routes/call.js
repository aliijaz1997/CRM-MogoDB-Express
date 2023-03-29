const router = require("express").Router();
const CallLog = require("../models/call.model");

router.get("/", async (req, res) => {
  try {
    const callLogs = await CallLog.find();
    res.status(200).json(callLogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  CallLog.findById(id)
    .then((call) => res.status(201).json(call))
    .catch((err) => res.status(400).json({ message: err.message }));
});

router.post("/", async (req, res) => {
  const callLog = new CallLog({
    createdAt: req.body.createdAt,
    duration: req.body.duration,
    type: req.body.type,
    notes: req.body.notes,
  });
  try {
    const newCallLog = await callLog.save();
    res.status(201).json(newCallLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const callLogObj = {};
  if (req.body.createdAt != null) {
    callLogObj.createdAt = req.body.createdAt;
  }
  if (req.body.duration != null) {
    callLogObj.duration = req.body.duration;
  }
  if (req.body.type != null) {
    callLogObj.type = req.body.type;
  }
  if (req.body.notes != null) {
    callLogObj.notes = req.body.notes;
  }
  try {
    CallLog.updateOne({ _id: id }, { ...callLogObj }).then(() => {
      return res.status(204).json("Call updated Successfully");
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await res.callLog.remove();
    res.json({ message: "Call log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
