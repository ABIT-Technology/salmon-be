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
			const [results, metadata] = await sequelize.query(
				`SELECT TOP 1 * FROM SBF01X WHERE VALID = ${0} AND APP = ${0} AND REJECT = ${0} 
				AND ACC_NO = '${ACC_NO}' AND SALMON2_ID = '${SALMON2_ID}'
				ORDER BY ID1 DESC;`,
			);

			if (results.length > 0) {
				return res.status(404).send({
					code: 400,
					message: "Sedang menunggu persetujuan admin",
				});
			}

			const [results2, metadata2] = await sequelize.query(
				`SELECT TOP 1 * FROM SBF01X WHERE APP = ${1} AND VALID=${1} AND REJECT = ${0}
				AND ACC_NO = '${ACC_NO}' AND SALMON2_ID = '${SALMON2_ID}'
				ORDER BY ID1 DESC;`,
			);

			if (results2.length > 0) {
				let logger = { ID1: results2[0].ID1 };
				req.logger = logger;
				return next();
			}

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
