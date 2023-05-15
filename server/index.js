const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const notificationRouter = require("./routes/notification");
const callRouter = require("./routes/call");
const VerifyToken = require("./middlewere/verifyToken");
const http = require("http");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);
dayjs.extend(timezone);
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("add-user", (phoneNumber) => {
    onlineUsers.set(phoneNumber, socket.id);
    console.log("Total Users", onlineUsers);
  });

  socket.on("call-to-client", ({ to, from }) => {
    const receiver = onlineUsers.get(to.phoneNumber);
    const caller = onlineUsers.get(from.phoneNumber);
    if (receiver) {
      socket.to(receiver).emit("call-receive", { to, from });
    } else {
      io.to(caller).emit("not-available", { to });
    }
  });

  socket.on("accept-call", ({ to, from }) => {
    console.log(`User ${to.name} has accepted the call from ${from.name}`);
    const caller = onlineUsers.get(from.phoneNumber);
    const receiver = onlineUsers.get(to.phoneNumber);

    io.to(caller).emit("call-accepted", {
      to,
      from,
    });
    io.to(receiver).emit("call-accepted", {
      to,
      from,
    });
    const startTime = dayjs();
    timer = setInterval(() => {
      const currentTime = dayjs();
      const diffInSeconds = Math.floor((currentTime - startTime) / 1000);
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds - hours * 3600) / 60);
      const seconds = diffInSeconds - hours * 3600 - minutes * 60;
      const timeString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      io.to(caller).emit("update-timer", timeString);
      io.to(receiver).emit("update-timer", timeString);
    }, 1000);
  });

  socket.on("reject-call", ({ to, from }) => {
    console.log(`User ${to.name} has rejected the call from ${from.name}`);
    const caller = onlineUsers.get(from.phoneNumber);
    const receiver = onlineUsers.get(to.phoneNumber);
    io.to(caller).emit("call-rejected", {
      to,
      from,
    });
    io.to(receiver).emit("call-rejected", {
      to,
      from,
    });
  });
  socket.on("cancel-call", ({ to, from }) => {
    const receiver = onlineUsers.get(to.phoneNumber);
    io.to(receiver).emit("call-canceled", {
      to,
      from,
    });
  });
});

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const mongooseConnection = mongoose.connection;
mongooseConnection.once("open", () => {
  console.log("MongoDB Connected Successfully!");
});
app.use("/user", VerifyToken, userRouter);
app.use("/notification", VerifyToken, notificationRouter);
app.use("/calls", VerifyToken, callRouter);

server.listen(port, () => {
  console.log(
    `Server is running at port number = ${port} with Mongo URI = ${uri}`
  );
});
