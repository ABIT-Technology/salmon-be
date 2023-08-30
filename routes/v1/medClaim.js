const express = require("express");
const multer = require("multer");
const router = express.Router();
const { medClaimController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");
const { uploader } = require("../../middlewares/uploader");

router.get("/medical-taken", medClaimController.medicalTaken);
router.get("/medical-list", medClaimController.medicalList);
router.post(
	"/apply-medical",
	multer().none(),
	medClaimController.applyMedicalClaim,
);
router.get("/medical-claim-list", medClaimController.medicalClaimList);

module.exports = router;
