const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");
const logger = require("../../middlewares/logger");

router.get("/", userController.getAll);
router.get("/getProfile", authJwt, userController.getProfile);
router.get("/details", authJwt, userController.details);
router.post("/check-active-status", authJwt, userController.checkActiveStatus);
router.post("/login", logger.login, userController.login);
router.post("/create", userController.create);

module.exports = router;
