const express = require("express");
const router = express.Router();
const { medClaimController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.get("/medical-taken", authJwt, medClaimController.medicalTaken);
router.get("/medical-list", authJwt, medClaimController.medicalList);

module.exports = router;
