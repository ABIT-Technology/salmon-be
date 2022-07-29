const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const { SBF01A } = require("../../models");

module.exports = async (req, res) => {
	try {
		const user = await SBF01A.findOne({
			where: { IDK: req.user.IDK },
			raw: true,
		});

		if (!user) {
			return res.status(409).send({
				code: 409,
				message: "User not authorized",
			});
		}

		const [results, metadata] = await sequelize.query(
			"SELECT * FROM ABF02A WHERE AKTIF = 1 AND IDK ='" + req.user.IDK + "'",
		);
		res.json(global.getStandardResponse(0, "success", results));
	} catch (err) {
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
