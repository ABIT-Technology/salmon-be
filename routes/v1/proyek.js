const express = require("express");
const router = express.Router();
const { proyekController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");


router.get("/getKegiatan",authJwt,proyekController.getKegiatanProyek)
router.post("/getProyek",authJwt,proyekController.getProyek.getProyek)
router.get("/getMasterProyek",authJwt,proyekController.getProyek.getMasterProyek)
router.post("/SubmitProyek",authJwt,proyekController.PostProyek.SubmitProyek)
router.post("/ViewDetailProyek",authJwt,proyekController.PostProyek.ViewDetailProyek)
router.get("/ViewUnfinishedProyek",authJwt,proyekController.PostProyek.ViewUnfinishedProyek)

module.exports = router;