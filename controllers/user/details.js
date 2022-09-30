const sequelizeSBOX = require("../../config/configdb2");

module.exports = async (req, res) => {
	try {
		const [results, metadata] = await sequelizeSBOX.query(
			`SELECT a.*, b.NAMA, b.NABAGIAN FROM SBF01A a JOIN salmon2.dbo.vwABF02A b ON
			a.IDK = b.IDK WHERE a.AKTIF = ${1} AND a.IDK = '${req.user.IDK}';`,
		);

		if (results.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}

		res.send({
			code: 0,
			message: "Success",
			data: results[0],
		});
	} catch (err) {
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
