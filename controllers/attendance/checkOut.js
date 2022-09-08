const Joi = require("joi");
const { sequelize, SXT05, SBF01A } = require("../../models");

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
		const user = await SBF01A.findOne({
			where: { IDK: req.user.IDK },
			raw: true,
		});

		if (!user) {
			return res.status(409).send({
				code: 409,
				message: "User not found",
			});
		}

		// const attendance = await SXT05.findAll({
		// 	where: { IDK: req.user.IDK },
		// 	order: [["TGL_INPUT", "DESC"]],
		// 	raw: true,
		// });

		// if (attendance.length < 0) {
		// 	return res.status(409).send({
		// 		code: 409,
		// 		message: "Attendance not found",
		// 	});
		// }
		// req.body.ID1_REF = attendance[0].ID1;
		req.body.TYPE = 2;
		req.body.IDK = req.user.IDK;

		await SXT05.create(req.body);
		await t.commit();
		res.send({
			code: 0,
			message: "Success",
		});
	} catch (err) {
		console.log(err);
		await t.rollback();
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
