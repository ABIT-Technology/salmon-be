const sequelize = require("../../config/configdb");
const global = require("../../config/global");

module.exports = async (req, res) => {
	try {
		const [results, metadata] = await sequelize.query(
			`SELECT
			A.*
			FROM vwABF10B A
			INNER JOIN (SELECT IDK, WIL FROM sbox.dbo.SBF01E WHERE AKTIF = 1 GROUP BY IDK, WIL) 
			B ON A.WIL = B.WIL
			WHERE B.IDK = '${req.user.IDK}'`,
		);
		res.json(global.getStandardResponse(0, "success", results));
	} catch (err) {
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
