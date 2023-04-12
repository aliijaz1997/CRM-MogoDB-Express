const router = require("express").Router();
const CallLog = require("../models/call.model");

router.get("/", async (req, res) => {
  try {
    let { page, limit, startDate, endDate, sort, ...rest } = req.query;
    const filters = {};
    Object.entries(rest).forEach(([field, value]) => {
      if (value) {
        const [fieldName, operator] = field.split("_");
        switch (operator) {
          case "equals" || "=":
            if (fieldName === "createdBy:id") {
              filters["createdBy._id"] = value;
            }
            filters[fieldName] = value;
            break;
          case "notEquals":
            filters[fieldName] = { $ne: value };
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
          case "greaterThan":
            filters[fieldName] = { $gt: value };
            break;
          case "greaterThanOrEqual":
            filters[fieldName] = { $gte: value };
            break;
          case "lessThan":
            filters[fieldName] = { $lt: value };
            break;
          case "lessThanOrEqual":
            filters[fieldName] = { $lte: value };
            break;

          default:
            break;
        }
      }
    });

    page = parseInt(page) || 0;
    limit = parseInt(limit) || 10;
    const skip = page * limit;

    const query = {};
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const isDateRange =
      !isNaN(startDateTime.getTime()) && !isNaN(endDateTime.getTime());
    if (isDateRange) {
      query.createdAt = { $gte: startDateTime, $lte: endDateTime };
    }

    const sortObj = {};
    if (sort) {
      const sortArr = sort.split(",");
      sortArr.forEach((sortItem) => {
        const [field, sortDirection] = sortItem.split(":");
        sortObj[field] = sortDirection;
      });
    }

    let callLogsQuery = CallLog.find({ ...query, ...filters }).sort(sortObj);
    const callLogs = await callLogsQuery.exec();

    const filteredLogs = callLogs.filter((log) => {
      let include = true;
      Object.entries(rest).forEach(([fieldOperator, value]) => {
        const [fieldName, operator] = fieldOperator.split("_");
        const field = log[fieldName];

        if (operator === "contains") {
          include = field.toLowerCase().includes(value.toLowerCase());
        } else if (operator === "startsWith") {
          include = field.toLowerCase().startsWith(value.toLowerCase());
        } else if (operator === "endsWith") {
          include = field.toLowerCase().endsWith(value.toLowerCase());
        }
      });
      return include;
    });
    const endIndex = skip + parseInt(limit);
    const limitedLogs = filteredLogs.slice(skip, endIndex);

    if (isDateRange) {
      res.status(200).json({
        totalLogs: filteredLogs.length,
        callLogs: filteredLogs,
      });
    } else {
      res.status(200).json({
        totalLogs: filteredLogs.length,
        callLogs: limitedLogs,
      });
    }
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
