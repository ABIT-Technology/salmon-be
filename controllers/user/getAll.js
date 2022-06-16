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
		console.log(err);
	}
};
