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
let callAcceptClients = [];
let callForwardToClients = [];
let timerStartUsers = [];
let activeTimers = {};
let timeIntervalReference = {};
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("add-user", (phoneNumber) => {
    onlineUsers.set(phoneNumber, socket.id);
    console.log("Total Users", onlineUsers);
  });

  socket.on("call-to-client", ({ to, from }) => {
    const caller = onlineUsers.get(from.phoneNumber);
    callForwardToClients.push({ phoneNumber: to.phoneNumber, name: to.name });

    callForwardToClients.forEach((client) => {
      const receiver = onlineUsers.get(client.phoneNumber);
      if (receiver) {
        socket.to(receiver).emit("call-receive", { to, from });
      } else {
        io.to(caller).emit("not-available", { to: client });
      }
    });
  });

  socket.on("accept-call", ({ to, from }) => {
    const caller = onlineUsers.get(from.phoneNumber);

    callAcceptClients.push({ phoneNumber: to.phoneNumber, name: to.name });
    callForwardToClients = callForwardToClients.filter(
      (c) => c.phoneNumber !== to.phoneNumber
    );

    callAcceptClients.forEach((client) => {
      const receiver = onlineUsers.get(client.phoneNumber);
      const isAlreadyTimerStarted = timerStartUsers.find(
        (u) => u.phoneNumber === client.phoneNumber
      );
      if (!isAlreadyTimerStarted) {
        io.to(caller).emit("call-accepted", {
          to: callAcceptClients,
          from,
        });
        io.to(receiver).emit("call-accepted", {
          to: client,
          from,
        });
        const startTime = dayjs();
        timeIntervalReference[client.phoneNumber] = setInterval(() => {
          const currentTime = dayjs();
          const diffInSeconds = Math.floor((currentTime - startTime) / 1000);
          const hours = Math.floor(diffInSeconds / 3600);
          const minutes = Math.floor((diffInSeconds - hours * 3600) / 60);
          const seconds = diffInSeconds - hours * 3600 - minutes * 60;
          const timeString = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

          io.to(receiver).emit("update-timer", timeString);
          activeTimers = { ...activeTimers, [client.phoneNumber]: timeString };
          io.to(caller).emit("update-timer", activeTimers);
        }, 1000);
        timerStartUsers.push(client);
      }
    });
  });

  socket.on("reject-call", ({ to, from }) => {
    const caller = onlineUsers.get(from.phoneNumber);
    const receiver = onlineUsers.get(to.phoneNumber);
    callForwardToClients = callForwardToClients.filter(
      (c) => c.phoneNumber !== to.phoneNumber
    );
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
  socket.on("end-call", ({ to, from }) => {
    const receiver = onlineUsers.get(to.phoneNumber);
    const caller = onlineUsers.get(from.phoneNumber);
    callAcceptClients = callAcceptClients.filter(
      (c) => c.phoneNumber !== to.phoneNumber
    );

    timerStartUsers = timerStartUsers.filter(
      (c) => c.phoneNumber !== to.phoneNumber
    );
    const callDuration = activeTimers[to.phoneNumber];
    const interval = timeIntervalReference[to.phoneNumber];
    if (interval) {
      clearInterval(interval);
    }
    io.to(receiver).emit("call-ended", {
      to,
      from,
      duration: callDuration,
    });
    io.to(caller).emit("call-ended", {
      to,
      from,
    });

    delete activeTimers[to.phoneNumber];
    delete timeIntervalReference[to.phoneNumber];
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
