const userController = require("./user");
const attendanceController = require("./attendance");
const kegiatanController = require("./kegiatan");
const proyekController = require("./proyek");
const monitoringController = require("./monitoring");
const stokController = require("./stok");
const notificationController = require("./notification");
const reportingController = require("./reporting");
const medClaimController = require("./medClaim");
const permitClaimController = require("./permitClaim");

module.exports = {
	userController,
	attendanceController,
	kegiatanController,
	proyekController,
	monitoringController,
	stokController,
	notificationController,
	reportingController,
	medClaimController,
	permitClaimController,
};
