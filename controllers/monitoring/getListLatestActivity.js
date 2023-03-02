const Joi = require("joi");
const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");
const { format, addDays } = require("date-fns");

module.exports = async (req, res) => {
	try {
		const schema = Joi.object({
			MONTH: Joi.string().allow("", null).required(),
			IDK: Joi.number().required(),
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

		const [results1, metadata1] = await sequelizeSBOX.query(
			`SELECT * FROM SBF01A WHERE IDK = ${req.user.IDK};`,
		);

		if (results1.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}

		const yearNow = new Date().getFullYear();

		let dailyActivity = [];

		for (let k = 12; k > 0; k--) {
			const lastDate = new Date(yearNow, k, 0).getDate();
			const [results12, metadata12] = await sequelize.query(
				`SELECT a.GTYPE, a.KET, a.NILAI, c.IDK, count(a.GTYPE) AS TOTAL_COUNT FROM sbox.dbo.SBF03A a
				JOIN sbox.dbo.SBF03B b
				ON a.ID1 = b.ID1
				JOIN salmon2.dbo.SXT01A c
				ON b.VISIT_ID = c.VISIT_ID
				WHERE c.IDK = ${req.query.IDK} AND c.STATUS = 1 
				AND CONVERT(date, c.TGL) BETWEEN '${yearNow}-${k}-1' AND '${yearNow}-${k}-${lastDate}'
				GROUP BY a.GTYPE, a.KET, a.NILAI, c.IDK;`,
			);

			const [results6, metadata6] = await sequelize.query(
				`SELECT a.COY_ID, b.GTYPE, b.BK${k} FROM sbox.dbo.SBF05A a
				JOIN sbox.dbo.SBF05B b
				ON a.ID1 = b.ID1
				WHERE a.COY_ID = 1 AND a.THN = ${yearNow};`,
			);

			for (let i = 0; i < results12.length; i++) {
				results12[i].BUDGET = 0;
				for (let j = 0; j < results6.length; j++) {
					if (results12[i].GTYPE === results6[j].GTYPE) {
						results12[i].BUDGET = results6[j][`BK${k}`];
					}
				}
			}

			for (let i = lastDate; i > 0; i--) {
				const [results2, metadata2] = await sequelize.query(
					`SELECT a.GTYPE, a.KET, a.NILAI, c.IDK, c.TGL, c.ID1 FROM sbox.dbo.SBF03A a
					JOIN sbox.dbo.SBF03B b
					ON a.ID1 = b.ID1
					JOIN salmon2.dbo.SXT01A c
					ON b.VISIT_ID = c.VISIT_ID
					WHERE c.IDK = ${req.query.IDK} AND c.STATUS = 1 
					AND CONVERT(date, c.TGL) = '${yearNow}-${k}-${i}'
					GROUP BY a.GTYPE, a.KET, a.NILAI, c.IDK, C.TGL, c.ID1
					ORDER BY c.TGL DESC;`,
				);

				if (results2[0]) {
					for (let j = 0; j < results12.length; j++) {
						if (results2[0].GTYPE === results12[j].GTYPE) {
							dailyActivity.push({
								ID: `${k}-${j}`,
								DATE: results2[0].TGL,
								DETAILS: {
									...results2[0],
									BUDGET: results12[j].BUDGET,
									TOTAL_COUNT: results12[j].TOTAL_COUNT,
								},
							});
						}
					}
				}
			}
		}

		res.json(global.getStandardResponse(0, "success", dailyActivity));
	} catch (err) {
		console.log(err);
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
