const { ABF27C } = require("../../models");
const { createJWTToken } = require("../../middlewares/jwt");

module.exports = async (req, res) => {
	try {
		const att = await ABF27C.findAll({
			order: [["TGL_UPDATE", "DESC"]],
		});

		res.send({
			code: 0,
			message: "Success",
			data: att,
		});
	} catch (err) {
		console.log(err);
	}
};
