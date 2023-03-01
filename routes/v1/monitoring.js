const express = require("express");
const router = express.Router();
const { monitoringController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.get("/list-area", authJwt, monitoringController.getListArea);
router.get("/list-staff", authJwt, monitoringController.getStaffs);
router.get(
	"/list-latest-activity",
	authJwt,
	monitoringController.getListLatestActivity,
);

module.exports = router;
