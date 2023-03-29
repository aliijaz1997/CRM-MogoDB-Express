const router = require("express").Router();
let Notification = require("../models/notification.model");

router.route("/").get((_req, res) => {
  Notification.find()
    .then((notification) => res.status(201).json(notification))
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

router.route("/").put((req, res) => {
  const { _id } = req.body;
  try {
    if (_id) {
      Notification.updateOne({ _id }, { seen: true })
        .then(() => {
          return res.status(204).json("Notification updated successfully");
        })
        .catch((err) => res.status(400).json("Error Occurred is " + err));
    }
  } catch (err) {
    throw new Error(`Error Occurred: ${err}`);
  }
});

module.exports = router;
