const express = require("express");
const app = express();
const userRouter = require("./user");
const attendanceRouter = require("./attendance");

app.use("/user", userRouter);
app.use("/attendance", attendanceRouter);

app.use("/", function (req, res, next) {
	res.sendStatus(404);
});

module.exports = app;
