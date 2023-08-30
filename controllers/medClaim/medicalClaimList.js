const Joi = require("joi");
const sequelizeSalmon = require("../../config/configdb");
const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = async (req, res) => {
	try {
		// const [results1, metadata1] = await sequelizeSBOX.query(
		// 	`SELECT * FROM SBF01A WHERE IDK = ${req.user.IDK};`,
		// );

		// if (results1.length <= 0) {
		// 	return res.status(404).send({
		// 		code: 404,
		// 		message: "User not found",
		// 	});
		// }

		const [results2, metadata2] = await sequelizeSalmon.query(
			`SELECT * FROM axt01a WHERE IDK = '13368'`,
			// `SELECT * FROM axt01a WHERE IDK = '${req.user.IDK}'`
		);

		res.json(global.getStandardResponse(0, "success", results2));
	} catch (err) {
		console.log(err.message);
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
