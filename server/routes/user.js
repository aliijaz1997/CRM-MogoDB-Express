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
        displayName: fullName,
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
          description: `${addedBy.name} created the ${fullName}`,
        }).save();
        newUser
          .save()
          .then(() => res.status(201).json("User Created by Admin!"))
          .catch((err) => res.status(400).json("Error Occurred is " + err));
      })
      .catch((err) => res.status(400).json(err));
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
  try {
    if (name && role && id) {
      User.findById(id).then((user) => {
        new Notification({
          description: `${user.name} updated the details`,
        }).save();
      });
      User.updateOne({ _id: id }, { role, name })
        .then(() => {
          return res.status(204).json("User updated Successfully");
        })
        .catch((err) => res.status(400).json("Error Occurred is " + err));
    }

    if (role && id && !name) {
      User.findById(id).then((user) => {
        new Notification({
          description: `${user.name} changed the role to ${role}`,
        }).save();
      });

      User.updateOne({ _id: id }, { role })
        .then(() => {
          return res.status(204).json("User updated Successfully");
        })
        .catch((err) => res.status(400).json("Error Occurred is " + err));
    }

    if (id && name && !role) {
      User.findById(id).then((user) => {
        new Notification({
          description: `${user.name} changed the name to ${name}`,
        }).save();
      });

      User.updateOne({ _id: id }, { name })
        .then(() => {
          auth.updateUser(id, { displayName: name });
          return res.status(204).json("User updated Successfully");
        })
        .catch((err) => res.status(400).json("Error Occurred is " + err));
    }
  } catch (err) {
    throw new Error(`Error Occurred: ${err}`);
  }
});

router.route("/").delete((req, res) => {
  const id = req.body.id;
  User.findById(id).then((user) => {
    new Notification({
      description: `${user.name} is deleted by admin`,
    }).save();
  });

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
