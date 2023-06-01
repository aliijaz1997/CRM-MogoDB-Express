const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const { createClient } = require("redis");

dayjs.extend(utc);
dayjs.extend(timezone);

const redisClient = createClient(6379);

module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  redisClient.on("error", (error) => {
    console.error("Redis connection error", error);
  });

  redisClient.connect().then(() => {
    console.log("Redis is connected successfully");
  });

  let callAcceptClients = [];
  let callForwardToClients = [];
  let timerStartUsers = [];
  let timeIntervalReference = {};
  let transferRequestTime = dayjs();

  io.on("connection", (socket) => {
    socket.on("add-client", async (phoneNumber) => {
      redisClient.hSet("onlineClients", phoneNumber, socket.id);
      const totalClients = await redisClient.hGetAll("onlineClients");
      console.log("Total Clients", totalClients);
    });

    socket.on("add-admin", async (phoneNumber) => {
      redisClient.hSet("onlineAdmins", phoneNumber, socket.id);
      const totalAdmins = await redisClient.hGetAll("onlineAdmins");
      console.log("Total Admins", totalAdmins);
    });

    socket.on("call-to-client", async ({ to, from }) => {
      const caller = await redisClient.hGet("onlineAdmins", from.phoneNumber);
      callForwardToClients.push({ phoneNumber: to.phoneNumber, name: to.name });

      callForwardToClients.forEach(async (client) => {
        const receiver = await redisClient.hGet(
          "onlineClients",
          client.phoneNumber
        );
        if (receiver) {
          socket.to(receiver).emit("call-receive", { to, from });
        } else {
          io.to(caller).emit("not-available", { to: client });
        }
      });
    });

    socket.on("accept-call", async ({ to, from }) => {
      const caller = await redisClient.hGet("onlineAdmins", from.phoneNumber);

      callAcceptClients.push({ phoneNumber: to.phoneNumber, name: to.name });
      callForwardToClients = callForwardToClients.filter(
        (c) => c.phoneNumber !== to.phoneNumber
      );

      callAcceptClients.forEach(async (client) => {
        const receiver = await redisClient.hGet(
          "onlineClients",
          client.phoneNumber
        );
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
          timeIntervalReference[client.phoneNumber] = setInterval(async () => {
            const currentTime = dayjs();
            const diffInSeconds = Math.floor((currentTime - startTime) / 1000);
            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds - hours * 3600) / 60);
            const seconds = diffInSeconds - hours * 3600 - minutes * 60;
            const timeString = `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

            io.to(receiver).emit("update-timer", {
              timeString,
              clients: callAcceptClients,
            });
            redisClient.hSet("activeTimers", client.phoneNumber, timeString);
            const activeTimers = await redisClient.hGetAll("activeTimers");
            io.to(caller).emit("update-timer", activeTimers);
          }, 1000);
          timerStartUsers.push(client);
          redisClient.hSet(
            "clientsCallDuration",
            client.phoneNumber,
            startTime.toISOString()
          );
        }
      });
    });

    socket.on("reject-call", async ({ to, from }) => {
      const caller = await redisClient.hGet("onlineAdmins", from.phoneNumber);
      const receiver = await redisClient.hGet("onlineClients", to.phoneNumber);
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
    socket.on("cancel-call", async ({ to, from }) => {
      const receiver = await redisClient.hGet("onlineClients", to.phoneNumber);
      io.to(receiver).emit("call-canceled", {
        to,
        from,
      });
    });

    socket.on("end-call", async ({ to, from }) => {
      const receiver = await redisClient.hGet("onlineClients", to.phoneNumber);
      const caller = await redisClient.hGet("onlineAdmins", from.phoneNumber);
      callAcceptClients = callAcceptClients.filter(
        (c) => c.phoneNumber !== to.phoneNumber
      );

      timerStartUsers = timerStartUsers.filter(
        (c) => c.phoneNumber !== to.phoneNumber
      );
      const callDuration = await redisClient.hGet(
        "activeTimers",
        to.phoneNumber
      );
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

      redisClient.hDel("activeTimers", to.phoneNumber);
      delete timeIntervalReference[to.phoneNumber];
    });

    socket.on("transfer-request", async ({ to, from }) => {
      const prevCaller = await redisClient.hGet(
        "onlineAdmins",
        from.phoneNumber
      );
      const nextCaller = await redisClient.hGet("onlineAdmins", to.phoneNumber);

      if (nextCaller) {
        callAcceptClients.forEach(async (c) => {
          const receiver = await redisClient.hGet(
            "onlineClients",
            c.phoneNumber
          );
          const interval = timeIntervalReference[c.phoneNumber];
          if (interval) {
            clearInterval(interval);
          }
          timerStartUsers = [];
          redisClient.hDel("activeTimers", to.phoneNumber);
          transferRequestTime = dayjs();
          io.to(receiver).emit("transfer-accept-request", { to, from });
        });

        io.to(nextCaller).emit("transfer-accept-request", { to, from });
      } else {
        io.to(prevCaller).emit("admin-not-available");
      }
    });

    socket.on("transfer-request-accepted", async ({ caller, newCaller }) => {
      const prevCaller = await redisClient.hGet(
        "onlineAdmins",
        caller.phoneNumber
      );
      const nextCaller = await redisClient.hGet(
        "onlineAdmins",
        newCaller.phoneNumber
      );

      io.to(prevCaller).emit("call-transferred-success", { caller, newCaller });
      io.to(nextCaller).emit("call-transferred-started", {
        receivers: callAcceptClients,
        newCaller,
      });
      callAcceptClients.forEach(async (client) => {
        const receiver = await redisClient.hGet(
          "onlineClients",
          client.phoneNumber
        );
        const isAlreadyTimerStarted = timerStartUsers.find(
          (u) => u.phoneNumber === client.phoneNumber
        );
        if (!isAlreadyTimerStarted) {
          io.to(receiver).emit("call-transferred-started", {
            from: newCaller,
            to: client,
          });

          const clientPausedDuration = await redisClient.hGet(
            "clientsCallDuration",
            client.phoneNumber
          );

          timeIntervalReference[client.phoneNumber] = setInterval(async () => {
            const currentTime = dayjs();
            const diffInSeconds =
              Math.floor((currentTime - dayjs(clientPausedDuration)) / 1000) -
              Math.floor(
                (transferRequestTime - dayjs(clientPausedDuration)) / 1000
              );
            console.log(client.phoneNumber, clientPausedDuration);
            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds - hours * 3600) / 60);
            const seconds = diffInSeconds - hours * 3600 - minutes * 60;
            const timeString = `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

            io.to(receiver).emit("update-timer", {
              timeString,
              clients: callAcceptClients,
            });
            redisClient.hSet("activeTimers", client.phoneNumber, timeString);
            const activeTimers = await redisClient.hGetAll("activeTimers");
            timerStartUsers.push(client);
            io.to(nextCaller).emit("update-timer", activeTimers);
          }, 1000);
        }
      });
    });
  });
};
