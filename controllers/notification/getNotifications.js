const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = async (req, res) => {
	try {
		const [results, metadata] = await sequelizeSBOX.query(
			`SELECT ID1, IDK, TGL, JUDUL, READ_
			FROM SBT05
			WHERE IDK = ${req.user.IDK}
			ORDER BY TGL_INPUT DESC;`,
		);

		res.json(global.getStandardResponse(0, "success", results));
	} catch (err) {
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
