const express = require("express");
const app = express();
const userRouter = require("./user");
const attendanceRouter = require("./attendance");
const kegiatanRouter = require("./kegiatan");
const proyekRouter = require("./proyek");
const monitoringRouter = require("./monitoring");
const stokRouter = require("./stok");
const notificationRouter = require("./notification");

app.use("/user", userRouter);
app.use("/attendance", attendanceRouter);
app.use("/kegiatan", kegiatanRouter);
app.use("/proyek", proyekRouter);
app.use("/monitoring", monitoringRouter);
app.use("/stok", stokRouter);
app.use("/notification", notificationRouter);

app.use("/", function (req, res, next) {
	res.sendStatus(404);
});

module.exports = app;
