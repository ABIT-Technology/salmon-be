const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.get("/", userController.getAll);
router.get("/getProfile", authJwt, userController.getProfile);
router.get("/details", authJwt, userController.details);
router.post("/check-active-status", authJwt, userController.checkActiveStatus);
router.post("/login", userController.login);
router.post("/create", userController.create);

module.exports = router;
