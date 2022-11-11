const Joi = require("joi");
const sequelizeSBOX = require("../../config/configdb2");
const sequelize = require("../../config/configdb");
const global = require("../../config/global");

module.exports = async (req, res) => {
	const schema = Joi.object({
		LAT_: Joi.number().required(),
		LONG_: Joi.number().required(),
		COURSE: Joi.number().required(),
		SPEED: Joi.number().required(),
		TGL: Joi.string().required(),
		SIGNAL: Joi.number().allow(null).required(),
		BATTERY: Joi.number().required(),
		ALTITUDE: Joi.number().required(),
		ACCURATE: Joi.number().required(),
		PHOTO: Joi.string().required(),
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
		const [results, metadata] = await sequelizeSBOX.query(
			`SELECT * FROM SBF01A WHERE IDK = '${req.user.IDK}';`,
		);

		if (results.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}
		let imagefilename = global.uploadBase64Image({ string: req.body.PHOTO });

		const sql = `INSERT INTO SXT04(IDK,LAT_,LONG_,COURSE,SPEED,TGL,SIGNAL,BATTERY,ALTITUDE,ACCURATE,PHOTO) 
				values('${req.user.IDK}','${req.body.LAT_}','${req.body.LONG_}',
				'${req.body.COURSE}','${req.body.SPEED}','${req.body.TGL}',
				'${req.body.SIGNAL}','${req.body.BATTERY}','${req.body.ALTITUDE}',
				'${req.body.ACCURATE}','${imagefilename}');`;
		await sequelize.query(sql, {
			type: sequelize.QueryTypes.INSERT,
		});

		return res.send({
			code: 0,
			message: "Success",
		});
	} catch (err) {
		return res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
