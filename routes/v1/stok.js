const express = require("express");
const router = express.Router();
const { stokController } = require("../../controllers");
const { authJwt } = require("../../middlewares/jwt");

router.post("/HitungStok",authJwt,stokController.PostHitungStok.HitungStok)
router.get("/getCustomer",authJwt,stokController.getCustomer.getAll)
router.post("/getItembyCustomerId",authJwt,stokController.getCustomerItem.getItembyCustomerId)

module.exports = router;