const sequelize = require("../../config/configdb");
const sequelizeSBOX = require("../../config/configdb2");
const global = require("../../config/global");

module.exports = {
	getMasterProyek: async (req, res) => {
		try {
			const [results1, metadata1] = await sequelizeSBOX.query(
				`SELECT * FROM SBF01A WHERE IDK = ${req.user.IDK};`,
			);

			if (results1.length <= 0) {
				return res.status(404).send({
					code: 404,
					message: "User not found",
				});
			}

			const [results, metadata] = await sequelize.query(
				"select * from SXT02A a left join SXT02B b on a.ID1 = b.ID1" +
					" where b.IDK = " +
					req.user.IDK,
			);
			res.json(global.getStandardResponse(0, "success", results));
		} catch (err) {
			res.status(500).json(global.getStandardResponse(500, "API error", null));
		}
	},
	getProyek: async (req, res) => {
		try {
			const [results1, metadata1] = await sequelizeSBOX.query(
				`SELECT * FROM SBF01A WHERE IDK = ${req.user.IDK};`,
			);

			if (results1.length <= 0) {
				return res.status(404).send({
					code: 404,
					message: "User not found",
				});
			}

			const [results, metadata] = await sequelize.query(
				"SELECT * FROM SXT02C where MONTH(TGL) = " +
					req.body.BLN +
					" AND YEAR(TGL) = " +
					req.body.THN,
			);
			res.json(global.getStandardResponse(0, "success", results));
		} catch (err) {
			res.status(500).json(global.getStandardResponse(500, "API error", null));
		}
	},
};
