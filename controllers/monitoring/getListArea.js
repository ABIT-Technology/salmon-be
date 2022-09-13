const sequelize = require("../../config/configdb");
const global = require("../../config/global");

module.exports = async (req, res) => {
	try {
		const [results, metadata] = await sequelize.query(
			"SELECT * FROM VWABF10B WHERE WIL != '00' ORDER BY ID1 ASC",
		);
		res.json(global.getStandardResponse(0, "success", results));
	} catch (err) {
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
