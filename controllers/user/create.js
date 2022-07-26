const Joi = require("joi");
const { SBF01A } = require("../../models");

module.exports = async (req, res) => {
	const schema = Joi.object({
		IDK: Joi.number().required(),
		ACC_NO: Joi.string().optional().allow("", null),
		PRIV_ID: Joi.number().optional().allow(null),
		ACC_AKTIF: Joi.number().optional().allow(null),
		AKTIF: Joi.number().optional().allow(null),
		TGL_INPUT: Joi.string().optional().allow(null),
		USER_INPUT: Joi.string().optional().allow("", null),
		TGL_UPDATE: Joi.string().optional().allow(null),
		USER_UPDATE: Joi.string().optional().allow("", null),
		DEVICE_ID: Joi.string().optional().allow("", null),
		ACCOUNT_ID: Joi.string().optional().allow("", null),
		STATUSA: Joi.number().optional().allow(null),
		SEGMENT: Joi.string().optional().allow("", null),
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
		const user = await SBF01A.findOne({
			where: { IDK: req.body.IDK },
		});

		if (user) {
			return res.status(409).send({
				code: 409,
				message: "User already exist",
			});
		}

		const createdUser = await SBF01A.create(req.body);

		res.send({
			code: 0,
			message: "Success",
			data: createdUser,
		});
	} catch (err) {
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
