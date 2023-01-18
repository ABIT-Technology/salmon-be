const Joi = require("joi");
const { SXT05 } = require("../../models");
const sequelizeSBOX = require("../../config/configdb2");
const sequelize = require("../../config/configdb");
const { format } = require("date-fns");

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

	const t = await sequelize.transaction();
	try {
		const [results, metadata] = await sequelizeSBOX.query(
			`SELECT * FROM SBF01A WHERE AKTIF = ${1} AND IDK = '${req.user.IDK}';`,
		);

		if (results.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}

		const [results2, metadata2] = await sequelize.query(
			`SELECT TOP 1 * FROM SXFSYS ORDER BY ID1 DESC;`,
		);

		req.body.VISIT_ID = "97";

		if (results2.length > 0) {
			req.body.VISIT_ID = results2[0].DEF_ABSEN_OUT;
		}

		req.body.TGL = format(new Date(req.body.TGL), "yyyy-MM-dd'T'HH:mm:ss'Z'");
		req.body.TYPE = 2;
		req.body.IDK = req.user.IDK;

		await SXT05.create(req.body);
		await t.commit();
		return res.send({
			code: 0,
			message: "Success",
		});
	} catch (err) {
		await t.rollback();
		return res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
