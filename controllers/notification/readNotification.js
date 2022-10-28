const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");
const { format } = require("date-fns");

module.exports = async (req, res) => {
	try {
		const [results, metadata] = await sequelizeSBOX.query(
			`SELECT * FROM SBT05 WHERE ID1 = ${req.body.ID1};`,
		);

		if (results.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "Notification not found",
			});
		}

		const sql = `UPDATE SBT05 SET READ_ = 1, 
		TGL_READ = '${format(new Date(req.body.TGL_READ), "yyyy-MM-dd HH:mm:ss.SSS")}', 
		TGL_UPDATE = GETDATE()
		WHERE ID1 = ${req.body.ID1};`;
		await sequelizeSBOX.query(sql, {
			type: sequelizeSBOX.QueryTypes.UPDATE,
		});

		res.json(global.getStandardResponse(0, "success"));
	} catch (err) {
		res
			.status(500)
			.json(global.getStandardResponse(500, "API error: " + err.message, null));
	}
};
