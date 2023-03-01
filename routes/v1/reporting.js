const express = require("express");
const router = express.Router();
const { reportingController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.get("/performance", authJwt, reportingController.individualPerformance);

module.exports = router;
