const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const notificationRouter = require("./routes/notification");
const VerifyToken = require("./middlewere/verifyToken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const mongooseConnection = mongoose.connection;
mongooseConnection.once("open", () => {
  console.log("MongoDB Connected Successfully!");
});
app.use("/user", VerifyToken, userRouter);
app.use("/notification", VerifyToken, notificationRouter);

app.listen(port, () => {
  console.log(
    `Server is running at port number = ${port} with Mongo URI = ${uri}`
  );
});
