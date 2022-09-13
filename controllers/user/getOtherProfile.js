const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const { SBF01A } = require("../../models");

module.exports = async (req, res) => {
	try {
		const user = await SBF01A.findOne({
			where: { IDK: req.query.IDK },
			raw: true,
		});

		if (!user) {
			return res.status(409).send({
				code: 409,
				message: "User not authorized",
			});
		}

		const [results, metadata] = await sequelize.query(
			`SELECT TOP 1 a.ID1, a.IDK, a.NIK, a.BAGIAN, c.NAWIL 
			FROM ABF02A a
			JOIN SBF01D b
			ON a.IDK = b.IDK
			JOIN VWABF10B c
			ON b.WIL = c.WIL
			WHERE a.AKTIF = 1 AND a.IDK = ${req.query.IDK};`,
		);
		res.json(global.getStandardResponse(0, "success", results));
	} catch (err) {
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
