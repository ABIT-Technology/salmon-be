const express = require("express");
const router = express.Router();
const { proyekController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");


router.get("/getKegiatan",proyekController.getKegiatanProyek)

module.exports = router;