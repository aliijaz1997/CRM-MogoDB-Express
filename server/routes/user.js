const router = require("express").Router();
let User = require("../models/user.model");
let Notification = require("../models/notification.model");
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
  addedBy = req.body.addedBy;
  if (addedBy) {
    auth
      .createUser({
        email,
        password: "P@$$w0rd",
      })
      .then((userRecord) => {
        const newUser = new User({
          _id: userRecord.uid,
          name: fullName,
          email,
          role,
          addedBy,
        });

        new Notification({
          description: `${addedBy.name} created the user ${userRecord.displayName}`,
        }).save();
        newUser
          .save()
          .then(() => res.status(201).json("User Created by Admin!"))
          .catch((err) => res.status(400).json("Error Occurred is " + err));
      });
    return;
  }
  const newUser = new User({
    _id,
    name: fullName,
    email,
    role,
  });

  newUser
    .save()
    .then(() => {
      return res.status(201).json("User added!");
    })
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

router.route("/").put((req, res) => {
  const { name, _id: id, role } = req.body;

  if (role && id) {
    new Notification({
      description: `The user ${name} has updated its role to ${role}`,
    }).save();
    User.updateOne({ _id: id }, { role })
      .then(() => {
        return res.status(204).json("User updated Successfully");
      })
      .catch((err) => res.status(400).json("Error Occurred is " + err));
  }

  if (id && name) {
    new Notification({
      description: `The user has updated its name to ${name}`,
    }).save();
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
  new Notification({
    description: ` user with ${id} is deleted `,
  }).save();
  User.deleteOne({ _id: id })
    .then(() => {
      auth.deleteUser(id);
      return res.status(204).json("User deleted Successfully");
    })
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

router.route("/auth").post((req, res) => {
  const id = req.body.id;
  auth.createCustomToken(id).then((token) => {
    return res.status(201).json({ token });
  });
});

module.exports = router;
