const express = require("express");
const router = express.Router();
const { notificationController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.get("/all", authJwt, notificationController.getNotifications);
router.get(
	"/details/:ID1",
	authJwt,
	notificationController.notificationDetails,
);
router.get(
	"/highlight",
	authJwt,
	notificationController.getHighlightNotification,
);
router.post("/read", authJwt, notificationController.readNotification);

module.exports = router;
