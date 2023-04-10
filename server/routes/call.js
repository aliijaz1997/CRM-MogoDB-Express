const router = require("express").Router();
const CallLog = require("../models/call.model");

router.get("/", async (req, res) => {
  try {
    let { page, limit, startDate, endDate, sort } = req.query;
    const filters = {};
    Object.entries(req.query).forEach(([field, value]) => {
      if (value) {
        const [fieldName, operator] = field.split("_");
        switch (operator) {
          case "contains":
            filters[fieldName] = { $regex: new RegExp(value, "i") };
            break;
          case "equals":
            filters[fieldName] = value;
            break;
          case "notEquals":
            filters[fieldName] = { $ne: value };
            break;
          case "startsWith":
            filters[fieldName] = { $regex: new RegExp(`^${value}`, "i") };
            break;
          case "endsWith":
            filters[fieldName] = { $regex: new RegExp(`${value}$`, "i") };
            break;
          case "isEmpty":
            filters[fieldName] = "";
            break;
          case "isNotEmpty":
            filters[fieldName] = { $ne: "" };
            break;
          case "isAnyOf":
            filters[fieldName] = { $in: value.split(",") };
            break;
          default:
            break;
        }
      }
    });
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const sortObj = {};
    if (sort) {
      const sortArr = sort.split(",");
      sortArr.forEach((sortItem) => {
        const [field, sortDirection] = sortItem.split(":");
        sortObj[field] = sortDirection;
      });
    }
    const totalLogs = await CallLog.countDocuments(query);
    let callLogsQuery = CallLog.find({ ...query, ...filters })
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
    const callLogs = await callLogsQuery.exec();
    res.status(200).json({
      totalLogs,
      callLogs,
    });
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
  const callLogs = await CallLog.find();
  const callLog = new CallLog({
    createdAt: req.body.createdAt,
    duration: req.body.duration,
    type: req.body.type,
    notes: req.body.notes,
    client: req.body.client,
    createdBy: req.body.createdBy,
    serialNumber: callLogs.length + 1,
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
  if (req.body.status != null) {
    callLogObj.status = req.body.status;
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
  const { id } = req.params;
  try {
    await CallLog.deleteOne({ _id: id });
    res.json({ message: "Call log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
