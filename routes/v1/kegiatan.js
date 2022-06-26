const express = require("express");
const router = express.Router();
const { kegiatanController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.get("/getKegiatan", kegiatanController.getKegiatan);
router.get("/getProduk", kegiatanController.getProduk);
router.get("/getCrops", kegiatanController.getCrops);
router.get("/getMedia", kegiatanController.getMedia);
router.get("/getCustomer", kegiatanController.getCustomer.getAll);
router.post("/getCustomerByName", kegiatanController.getCustomer.getByCustomerName);
router.post("/SubmitKegiatan", authJwt, kegiatanController.PostKegiatan.SubmitKegiatan);
router.post("/ViewDetailKegiatan", authJwt, kegiatanController.PostKegiatan.ViewDetailtKegiatan);
router.post("/UpdateStatusKegiatan", authJwt, kegiatanController.PostKegiatan.FinishKegiatan);

module.exports = router;