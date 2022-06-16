const express = require("express");
const router = express.Router();
const { attendanceController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.get("/abf27b", attendanceController.getAllABF27B);
router.get("/abf27c", attendanceController.getAllABF27C);
router.get(
	"/today-attendance",
	authJwt,
	attendanceController.getTodayAttendance,
);
router.post("/check-in", authJwt, attendanceController.checkIn);
router.post("/check-out", authJwt, attendanceController.checkOut);

module.exports = router;
