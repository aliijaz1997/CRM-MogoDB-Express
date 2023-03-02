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

router.route("/").put((req, res) => {
  const { name, _id: id, role } = req.body;

  if (role && id) {
    User.updateOne({ _id: id }, { role })
      .then(() => {
        return res.status(204).json("User updated Successfully");
      })
      .catch((err) => res.status(400).json("Error Occurred is " + err));
  }

  if (id && name) {
    User.updateOne({ _id: id }, { name })
      .then(() => {
        auth.updateUser(id, { displayName: name });
        return res.status(204).json("User updated Successfully");
      })
      .catch((err) => res.status(400).json("Error Occurred is " + err));
  }

  return new Error("Unable to update user");
});

router.route("/").delete((req, res) => {
  const id = req.body.id;
  User.deleteOne({ _id: id })
    .then(() => {
      auth.deleteUser(id);
      return res.status(204).json("User deleted Successfully");
    })
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

router.route("/auth").post((req, res) => {
  const id = req.body.id;
  auth
    .createCustomToken(id, { loginType: "Custom Login from admin" })
    .then((token) => {
      console.log({ token });
      return res.status(201).json({ token });
    });
});

module.exports = router;
