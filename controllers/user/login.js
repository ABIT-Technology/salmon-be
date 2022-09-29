const Joi = require("joi");
const { SBF01A, LOGINSALMON2, LOGINHISTORY } = require("../../models");
const { createJWTToken } = require("../../middlewares/jwt");
const sequelize = require("../../config/configdb");
const { JWT_ACCESS_TOKEN_SECRET } = process.env;

module.exports = async (req, res) => {
	const schema = Joi.object({
		SALMON2_ID: Joi.string().required(),
		ACC_NO: Joi.string().required(),
		LAT_: Joi.number().required(),
		LONG_: Joi.number().required(),
		COURSE: Joi.number().required(),
		SPEED: Joi.number().required(),
		TGL: Joi.string().required(),
		SIGNAL: Joi.number().required().allow(null, ""),
		BATTERY: Joi.number().required(),
		ALTITUDE: Joi.number().required(),
		ACCURATE: Joi.number().required(),
		LOKASI: Joi.string().required().allow(null, ""),
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

	const {
		SALMON2_ID,
		ACC_NO,
		LAT_,
		LONG_,
		COURSE,
		SPEED,
		TGL,
		SIGNAL,
		BATTERY,
		ALTITUDE,
		ACCURATE,
		LOKASI,
	} = req.body;

	try {
		const user = await SBF01A.findOne({
			where: {
				ACC_NO,
				SALMON2_ID,
				AKTIF: 1,
			},
			raw: true,
		});

		if (!user) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}

		// await LOGINSALMON2.create({
		// 	DEVICE_ID,
		// 	ACC_NO,
		// 	LAT_,
		// 	LONG_,
		// 	COURSE,
		// 	SPEED,
		// 	TGL,
		// 	SIGNAL,
		// 	BATTERY,
		// 	ALTITUDE,
		// 	ACCURATE,
		// 	LOKASI,
		// 	IDK: user.IDK,
		// });

		const sql = `UPDATE SBF01X SET ACC_NO = ${ACC_NO}, SALMON2_ID = ${SALMON2_ID}, VALID = ${true} WHERE ID1 = ${
			req.logger.ID1
		};`;
		await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
		// await LOGINHISTORY.update(
		// 	{
		// 		TGL_UPDATE: new Date(),
		// 		KET: "success",
		// 	},
		// 	{
		// 		where: { ID1: req.logger.ID1 },
		// 	},
		// );

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
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
