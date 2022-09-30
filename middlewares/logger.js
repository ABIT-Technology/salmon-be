const Joi = require("joi");
const { SBF01X } = require("../models");
const sequelize = require("../config/configdb2");

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
			const { SALMON2_ID, ACC_NO } = req.body;
			const sql = `INSERT INTO SBF01X(SALMON2_ID,ACC_NO) OUTPUT Inserted.ID1 VALUES('${SALMON2_ID}','${ACC_NO}');`;
			let logger = await sequelize.query(sql, {
				type: sequelize.QueryTypes.INSERT,
			});
			// const logger = await SBF01X.create({
			// 	SALMON2_ID,
			// 	ACC_NO,
			// 	TGL: new Date(TGL),
			// 	VALID: false,
			// });
			logger = { ID1: logger[0][0].ID1 };
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
