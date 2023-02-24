const router = require("express").Router();
let User = require("../models/user.model");
const auth = require("../config/firebase-config");

router.route("/").get((_req, res) => {
  User.find()
    .then((person) => res.status(201).json(person))
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((person) => res.status(201).json(person))
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

router.route("/").post((req, res) => {
  _id = req.body.id;
  fullName = req.body.name;
  email = req.body.email;
  role = req.body.role;

  const newUser = new User({
    _id,
    name: fullName,
    email,
    role,
  });

  newUser
    .save()
    .then(() => res.status(201).json("User added!"))
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

router.route("/").delete((req, res) => {
  const id = req.body.id;
  console.log("Deleting start", id);
  User.deleteOne({ _id: id })
    .then(() => {
      auth.deleteUser(id);
      return res.status(204).json("User deleted Successfully");
    })
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

module.exports = router;
