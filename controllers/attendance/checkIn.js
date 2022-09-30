const Joi = require("joi");
const { SXT05 } = require("../../models");
const sequelize = require("../../config/configdb2");

module.exports = async (req, res) => {
	const schema = Joi.object({
		LAT_: Joi.number().required(),
		LONG_: Joi.number().required(),
		COURSE: Joi.number().required(),
		SPEED: Joi.number().required(),
		TGL: Joi.string().required(),
		SIGNAL: Joi.number().allow(null).required(),
		BATTERY: Joi.number().required(),
		KET: Joi.string().required().allow(null, ""),
		COY_ID: Joi.string().required().allow(null, ""),
		VISIT_ID: Joi.string().required().allow(null, ""),
		ALTITUDE: Joi.number().required(),
		ACCURATE: Joi.number().required(),
		CUST: Joi.string().required().allow(null, ""),
		LOKASI: Joi.string().allow(null, "").required(),
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

	try {
		const [results, metadata] = await sequelize.query(
			`SELECT * FROM SBF01A WHERE AKTIF = ${1} AND IDK = '${req.user.IDK}';`,
		);

		if (results.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}

		req.body.IDK = req.user.IDK;
		req.body.TYPE = 1;

		await SXT05.create(req.body);

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
