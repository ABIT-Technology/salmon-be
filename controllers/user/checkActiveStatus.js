const { SBF01A } = require("../../models");
const { createJWTToken } = require("../../middlewares/jwt");

module.exports = async (req, res) => {
	try {
		const user = await SBF01A.findOne({
			where: { IDK: req.user.IDK, AKTIF: 1, ACC_NO: req.body.ACC_NO },
		});

		if (!user) {
			return res.status(404).send({
				code: 404,
				message: "User not active",
			});
		}

		res.send({
			code: 0,
			message: "Success",
		});
	} catch (err) {
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
