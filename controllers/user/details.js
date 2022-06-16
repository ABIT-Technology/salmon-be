const { SBF01A } = require("../../models");
const { createJWTToken } = require("../../middlewares/jwt");

module.exports = async (req, res) => {
	try {
		const user = await SBF01A.findOne({
			where: { IDK: req.user.IDK, AKTIF: 1 },
		});

		if (!user) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}

		res.send({
			code: 0,
			message: "Success",
			data: user,
		});
	} catch (err) {
		console.log(err);
	}
};
