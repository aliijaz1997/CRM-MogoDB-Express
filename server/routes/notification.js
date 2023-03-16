const router = require("express").Router();
let Notification = require("../models/notification.model");

router.route("/").get((_req, res) => {
  Notification.find()
    .then((notification) => res.status(201).json(notification))
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

module.exports = router;
