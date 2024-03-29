const Joi = require("joi");
const { Op } = require("sequelize");
const { SXT05 } = require("../../models");

module.exports = async (req, res) => {
	const schema = Joi.object({
		TGL: Joi.string().required(),
	}).options({
		allowUnknown: false,
	});

	const validate = schema.validate(req.query);

	if (validate.error) {
		return res.status(400).send({
			code: 400,
			message: validate.error.message,
		});
	}

	try {
		const attendance = await SXT05.findAll({
			where: {
				IDK: req.user.IDK,
				TGL: {
					[Op.between]: [
						new Date(req.query.TGL).setUTCHours(00, 00, 00, 000),
						new Date(req.query.TGL).setUTCHours(23, 59, 59, 999),
					],
				},
			},
			order: [["TGL_INPUT", "ASC"]],
		});

		res.send({
			code: 0,
			message: "Success",
			data: attendance,
		});
	} catch (err) {
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
