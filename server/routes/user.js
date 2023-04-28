const router = require("express").Router();
let User = require("../models/user.model");
let Notification = require("../models/notification.model");
const auth = require("../config/firebase-config");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);
dayjs.extend(timezone);

router.route("/").get(async (req, res) => {
  try {
    let { page, limit, startDate, endDate, sort, client, ...rest } = req.query;
    const filters = {};
    Object.entries(rest).forEach(([field, value]) => {
      if (value) {
        const [fieldName, operator] = field.split("_");
        switch (operator) {
          case "equals" || "=":
            if (fieldName === "addedBy:id") {
              filters["addedBy._id"] = value;
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
    const roleFilter =
      client === "true" ? { role: "client" } : { role: { $ne: "client" } };
    let usersQuery = User.find({
      ...roleFilter,
      ...query,
      ...filters,
    }).sort(sortObj);
    const users = await usersQuery.exec();
    const filteredUsers = users.filter((log) => {
      let include = true;
      Object.entries(rest).forEach(([fieldOperator, value]) => {
        const [fieldName, operator] = fieldOperator.split("_");
        let field = log[fieldName];

        if (field instanceof Date) {
          field = dayjs(field).tz("Asia/Karachi").format("MMMM D, YYYY h:mm A");
        }

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
    const limitedUsers = filteredUsers.slice(skip, endIndex);

    if (isDateRange) {
      res.status(200).json({
        totalUsers: filteredUsers.length,
        users: filteredUsers,
      });
    } else {
      res.status(200).json({
        totalUsers: filteredUsers.length,
        users: limitedUsers,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((person) => res.status(201).json(person))
    .catch((err) => res.status(400).json("Error Occurred is " + err));
});

router.route("/").post(async (req, res) => {
  _id = req.body.id;
  fullName = req.body.name;
  email = req.body.email;
  role = req.body.role;
  addedBy = req.body.addedBy;
  serialNumber = (await User.find()).length + 1;
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
          serialNumber,
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
    serialNumber,
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

router.route("/:id").delete(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID not found!" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await new Notification({
      description: `${user.name} was deleted by an admin`,
    }).save();

    await User.deleteOne({ _id: id });
    await auth.deleteUser(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/auth").post((req, res) => {
  const id = req.body.id;
  auth.createCustomToken(id).then((token) => {
    return res.status(201).json({ token });
  });
});

module.exports = router;
