const getKegiatan = require("./getKegiatan");
const getProduk = require("./getProduk.js");
const getCrops = require("./getCrops");
const getMedia = require("./getMedia");
const getCustomer = require("./getCustomer");
const PostKegiatan = require("./PostKegiatan");
// const { authJwt } = require("../../middlewares/jwt");


module.exports = {
	getKegiatan,
	getProduk,
	getCrops,
	getMedia,
	getCustomer,
	PostKegiatan,
};
