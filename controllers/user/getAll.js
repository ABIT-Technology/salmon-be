const { SBF01A } = require("../../models");
const { createJWTToken } = require("../../middlewares/jwt");

module.exports = async (req, res) => {
	try {
		const user = await SBF01A.findAll();

		res.send({
			code: 0,
			message: "Success",
			data: user,
		});
	} catch (err) {
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
