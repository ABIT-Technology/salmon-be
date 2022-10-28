const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = async (req, res) => {
	try {
		const [results, metadata] = await sequelizeSBOX.query(
			`SELECT TOP 1 * 
			FROM SBT05
			WHERE ID1 = ${req.params.ID1};`,
		);

		if (results.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "Notification not found",
			});
		}

		res.json(global.getStandardResponse(0, "success", results[0]));
	} catch (err) {
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
