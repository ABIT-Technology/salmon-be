const sequelize = require("../../config/configdb2");

module.exports = async (req, res) => {
	try {
		const [results, metadata] = await sequelize.query(
			`SELECT * FROM SBF01A WHERE AKTIF = ${1} AND ACC_NO = '${
				req.body.ACC_NO
			}' AND SALMON2_ID = '${req.body.SALMON2_ID}' AND IDK = '${
				req.user.IDK
			}';`,
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
		});
	} catch (err) {
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
