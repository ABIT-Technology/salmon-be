const express = require("express");
const router = express.Router();
const { kegiatanController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.get("/getKegiatan", authJwt, kegiatanController.getKegiatan);
router.get("/getProduk", authJwt, kegiatanController.getProduk);
router.get("/getProdukbyCust", authJwt, kegiatanController.getProdukbyCust);
router.get("/getProdukbyWil", authJwt, kegiatanController.getProdukbyWil);
router.get("/getCrops", authJwt, kegiatanController.getCrops);
router.get("/getMedia", authJwt, kegiatanController.getMedia);
router.get("/getCustomer", authJwt, kegiatanController.getCustomer.getAll);
router.post(
	"/getCustomerByName",
	authJwt,
	kegiatanController.getCustomer.getByCustomerName,
);
router.post(
	"/SubmitKegiatan",
	authJwt,
	kegiatanController.PostKegiatan.SubmitKegiatan,
);
router.post(
	"/ViewDetailKegiatan",
	authJwt,
	kegiatanController.PostKegiatan.ViewDetailtKegiatan,
);
router.post(
	"/ViewDetailKegiatanByVisitId",
	authJwt,
	kegiatanController.PostKegiatan.ViewDetailtKegiatanByVisitId,
);
router.get(
	"/ViewUnfinishedKegiatan",
	authJwt,
	kegiatanController.PostKegiatan.ViewUnfinishedKegiatan,
);
router.get(
	"/FinishKegiatan",
	authJwt,
	kegiatanController.PostKegiatan.FinishKegiatan,
);
router.post(
	"/SubmitKegiatanManual",
	authJwt,
	kegiatanController.PostKegiatan.SubmitKegiatanManual,
);

module.exports = router;
