const Joi = require("joi");
const { SBF01A } = require("../../models");
const { createJWTToken } = require("../../middlewares/jwt");
const { JWT_ACCESS_TOKEN_SECRET } = process.env;

module.exports = async (req, res) => {
	const schema = Joi.object({
		DEVICE_ID: Joi.string().required(),
		ACC_NO: Joi.string().required(),
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
			where: {
				ACC_NO: req.body.ACC_NO,
				DEVICE_ID: req.body.DEVICE_ID,
				AKTIF: 1,
			},
		});

		if (!user) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}

		const accessToken = createJWTToken(
			{ IDK: user.IDK },
			JWT_ACCESS_TOKEN_SECRET,
		);

		res.send({
			code: 0,
			message: "Success",
			data: {
				ACC_NO: user.ACC_NO,
				accessToken,
			},
		});
	} catch (err) {
		console.log(err);
	}
};
