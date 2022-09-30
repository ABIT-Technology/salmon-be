const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = async (req, res) => {
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
			`SELECT TOP 1 a.ID1, a.IDK, a.NIK, a.BAGIAN, d.NAWIL 
			FROM vwABF02A a
			JOIN SBF01A b
			ON a.IDK = b.IDK
			JOIN SBF01D c
			ON b.ID1 = c.ID1
			JOIN VWABF10B d
			ON c.WIL = d.WIL
			WHERE a.AKTIF = 1 AND a.IDK = ${req.user.IDK};`,
		);
		res.json(global.getStandardResponse(0, "success", results));
	} catch (err) {
		console.log(err);
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
