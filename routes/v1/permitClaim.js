const express = require("express");
const router = express.Router();
const { permitClaimController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.get("/calendar-off", authJwt, permitClaimController.calendarDayOff);
router.get("/calendar-on", authJwt, permitClaimController.calendarDayOn);
router.get("/permit-category", authJwt, permitClaimController.permitCategory);
router.get(
	"/permit-application",
	authJwt,
	permitClaimController.listPermitApplication,
);
router.get("/detail/:ID1", authJwt, permitClaimController.detailPermit);

router.post("/apply", authJwt, permitClaimController.applyPermit);

module.exports = router;
