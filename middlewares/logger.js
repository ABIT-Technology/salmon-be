const Joi = require("joi");
const { LOGINHISTORY } = require("../models");
const sequelize = require("../config/configdb");

module.exports = {
	login: async (req, res, next) => {
		try {
			const schema = Joi.object({
				SALMON2_ID: Joi.string().required(),
				ACC_NO: Joi.string().required(),
				TGL: Joi.string().required(),
			}).options({
				allowUnknown: true,
			});

			const validate = schema.validate(req.body);

			if (validate.error) {
				return res.status(400).send({
					code: 400,
					message: validate.error.message,
				});
			}
			const { SALMON2_ID, ACC_NO, TGL } = req.body;
			const sql = `INSERT INTP SBF01X(TGL,SALMON2_ID,ACC_NO,VALID) VALUES(${TGL},${SALMON2_ID},${ACC_NO},${false});`;
			const logger = await sequelize.query(sql, {
				type: sequelize.QueryTypes.INSERT,
			});
			// const logger = await LOGINHISTORY.create({
			// 	SALMON2_ID,
			// 	ACC_NO,
			// 	TGL: new Date(TGL),
			// 	KET: "pending",
			// 	TYPE: "login",
			// });
			req.logger = logger;
			return next();
		} catch (err) {
			return res.status(400).send({
				code: 400,
				message: err.message || "Server error",
			});
		}
	},
};
