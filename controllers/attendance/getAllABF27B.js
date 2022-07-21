const { ABF27B } = require("../../models");
const { createJWTToken } = require("../../middlewares/jwt");

module.exports = async (req, res) => {
	try {
		const att = await ABF27B.findAll({
			order: [["TGL_INPUT", "DESC"]],
		});

		res.send({
			code: 0,
			message: "Success",
			data: att,
		});
	} catch (err) {
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
