const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = {
	getAll: async (req, res) => {
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
				"SELECT * FROM vwARF01",
			);
			res.json(global.getStandardResponse(0, "success", results));
		} catch (err) {
			res.status(500).json(global.getStandardResponse(500, "API error", null));
		}
	},
	getByCustomerName: async (req, res) => {
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

			// GET COY_ID from current login user
			let COY_ID = "0";

			const results2 = await sequelize.query(
				"SELECT TOP 1 * FROM vwABF02A WHERE AKTIF = 1 AND IDK='" +
					req.user.IDK +
					"'",
			);
			if (results2 != null) {
				COY_ID = results2[0][0]["COY_ID"];
			}

			const [results, metadata] = await sequelize.query(
				"SELECT * FROM vwARF01 WHERE nama like '%" +
					req.body.nama +
					"%' AND COY_ID = '" +
					COY_ID +
					"'",
			);
			res.json(global.getStandardResponse(0, "success", results));
		} catch (err) {
			res.status(500).json(global.getStandardResponse(500, "API error", null));
		}
	},
};
