const Joi = require("joi");
const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const { SBF01A } = require("../../models");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = {
	HitungStok: async (req, res) => {
		const schema = Joi.object({
			TGL: Joi.string().required(),
			CUST: Joi.string().required(),
			LAT_: Joi.number().required(),
			LONG_: Joi.number().required(),
			COURSE: Joi.number().required(),
			TGL_INPUT: Joi.string().required(),
			SIGNAL: Joi.number().required(),
			BATTERY: Joi.number().required(),
			TYPE: Joi.string().required(),
			ALTITUDE: Joi.number().required(),
			ACCURATE: Joi.number().required(),
			LOKASI: Joi.string().allow(null, "").required(),
			BRG: Joi.array().allow(null, ""),
		}).options({
			allowUnknown: false,
		});

		const [user, metadata] = await sequelizeSBOX.query(
			`SELECT * FROM SBF01A WHERE IDK = '${req.user.IDK}';`,
		);

		if (user.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "User not authorized",
			});
		}

		const t = await sequelize.transaction();
		const validate = schema.validate(req.body);
		if (validate.error) {
			return res.status(400).send({
				code: 400,
				message: validate.error.message,
			});
		}
		try {
			const sqlprod =
				"INSERT INTO SXT03A(TGL,CUST,IDK,LAT_,LONG_,COURSE,TGL_INPUT,SIGNAL,BATTERY,TYPE,ALTITUDE,ACCURATE,LOKASI) VALUES(" +
				"'" +
				req.body.TGL +
				"','" +
				req.body.CUST +
				"','" +
				req.user.IDK +
				"','" +
				req.body.LAT_ +
				"','" +
				req.body.LONG_ +
				"','" +
				req.body.COURSE +
				"',GETDATE(),'" +
				req.body.SIGNAL +
				"','" +
				req.body.BATTERY +
				"','" +
				req.body.TYPE +
				"','" +
				req.body.ALTITUDE +
				"','" +
				req.body.ACCURATE +
				"','" +
				req.body.LOKASI +
				"')";

			let header = await sequelize
				.query(sqlprod, {
					type: sequelize.QueryTypes.INSERT,
					transaction: t,
				})
				.then(function () {
					const results2 = sequelize.query(
						"SELECT TOP 1 * FROM SXT03A WHERE IDK = '" +
							req.user.IDK +
							"' ORDER BY ID1 DESC",
						{ transaction: t },
					);
					if (results2 != null) {
						return results2;
					}
				});
			let headerid = header[0][0]["ID1"];

			// save product
			let BRG = req.body.BRG;
			const schemabarang = Joi.object({
				BRG: Joi.string().required(),
				STN: Joi.number().required(),
				QTY: Joi.number().required(),
			}).options({
				allowUnknown: false,
			});
			if (BRG !== undefined) {
				for (let i = 0; i < BRG.length; i++) {
					if (schemabarang.validate(BRG[i]).error) {
						throw new Error(schemabarang.validate(BRG[i]).error);
					}
					const sqlprod =
						"INSERT INTO SXT03B(ID1,BRG,QTY,STN) VALUES('" +
						headerid +
						"','" +
						BRG[i]["BRG"] +
						"','" +
						BRG[i]["QTY"] +
						"','" +
						BRG[i]["STN"] +
						"')";
					await sequelize.query(sqlprod, {
						type: sequelize.QueryTypes.INSERT,
						transaction: t,
					});
				}
			}
			// end of save product

			await t.commit();
			res.json(
				global.getStandardResponse(0, "success : hitung stok saved", null),
			);
		} catch (err) {
			await t.rollback();
			res
				.status(500)
				.json(
					global.getStandardResponse(500, "API error : " + err.message, null),
				);
		}
	},
};
