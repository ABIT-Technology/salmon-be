const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");
const logger = require("../../middlewares/logger");

router.get("/", userController.getAll);
router.get("/getProfile", authJwt, userController.getProfile);
router.get("/getOtherProfile", authJwt, userController.getOtherProfile);
router.get("/details", authJwt, userController.details);
router.get("/start/init-data", authJwt, userController.initStartData);
router.post("/check-active-status", authJwt, userController.checkActiveStatus);
router.post("/login", logger.login, userController.login);
router.post("/create", userController.create);
router.post("/track-location", authJwt, userController.trackLocation);

module.exports = router;
