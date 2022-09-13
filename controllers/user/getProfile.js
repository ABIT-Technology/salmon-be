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
			`SELECT TOP 1 a.ID1, a.IDK, a.NIK, a.BAGIAN, d.NAWIL 
			FROM ABF02A a
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
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
