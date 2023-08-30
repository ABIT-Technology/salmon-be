const Joi = require("joi");
const { SBF01A, SBF01X } = require("../../models");
const { createJWTToken } = require("../../middlewares/jwt");
const sequelize = require("../../config/configdb2");
const { JWT_ACCESS_TOKEN_SECRET } = process.env;

module.exports = async (req, res) => {
	const schema = Joi.object({
		SALMON2_ID: Joi.string().required(),
		ACC_NO: Joi.string().required(),
		// LAT_: Joi.number().required(),
		// LONG_: Joi.number().required(),
		// COURSE: Joi.number().required(),
		// SPEED: Joi.number().required(),
		TGL: Joi.string().required(),
		// SIGNAL: Joi.number().required().allow(null, ""),
		// BATTERY: Joi.number().required(),
		// ALTITUDE: Joi.number().required(),
		// ACCURATE: Joi.number().required(),
		// LOKASI: Joi.string().required().allow(null, ""),
	}).options({
		allowUnknown: false,
	});

	const validate = schema.validate(req.body);

	if (validate.error) {
		return res.status(400).send({
			code: 400,
			message: validate.error.message,
		});
	}

	const { SALMON2_ID, ACC_NO } = req.body;

	try {
		const [results, metadata] = await sequelize.query(
			`SELECT * FROM SBF01A WHERE AKTIF = ${1} AND ACC_NO = '${ACC_NO}' AND SALMON2_ID = '${SALMON2_ID}';`,
		);

		if (results.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}

		const sql = `UPDATE SBF01X SET ACC_NO = '${ACC_NO}', SALMON2_ID = '${SALMON2_ID}', VALID=1 WHERE ID1 = ${req.logger.ID1};`;
		await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });

		const accessToken = createJWTToken(
			{ IDK: results[0].IDK },
			JWT_ACCESS_TOKEN_SECRET,
		);

		console.log("access token => ", accessToken);

		res.send({
			code: 0,
			message: "Success",
			data: {
				ACC_NO: results[0].ACC_NO,
				accessToken,
			},
		});
	} catch (err) {
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
