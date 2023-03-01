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

		const monthNow =
			req.query.MONTH == 0
				? new Date().getMonth() + 1
				: parseInt(req.query.MONTH);
		const yearNow = new Date().getFullYear();
		var lastDate = new Date(yearNow, monthNow, 0).getDate();
		// const monthNow = 1;
		// const yearNow = 2023;
		// var lastDate = 30;

		const [results2, metadata2] = await sequelize.query(
			`SELECT a.GTYPE, a.KET, a.NILAI, c.IDK, count(a.GTYPE) AS TOTAL_COUNT FROM sbox.dbo.SBF03A a
			JOIN sbox.dbo.SBF03B b
			ON a.ID1 = b.ID1
			JOIN salmon2.dbo.SXT01A c
			ON b.VISIT_ID = c.VISIT_ID
			WHERE c.IDK = ${req.query.IDK} AND c.STATUS = 1 
			AND CONVERT(date, c.TGL) BETWEEN '${yearNow}-${monthNow}-1' AND '${yearNow}-${monthNow}-${lastDate}'
			GROUP BY a.GTYPE, a.KET, a.NILAI, c.IDK, c.IDK;`,
		);

		const [results3, metadata3] = await sequelize.query(
			`SELECT a.GTYPE, c.IDK
			FROM sbox.dbo.SBF03A a
			JOIN sbox.dbo.SBF03B b
			ON a.ID1 = b.ID1
			JOIN salmon2.dbo.SXT01A c
			ON b.VISIT_ID = c.VISIT_ID
			WHERE c.IDK = ${req.query.IDK} AND c.STATUS = 1 
			AND CONVERT(date, c.TGL) BETWEEN '${yearNow}-${monthNow}-1' AND '${yearNow}-${monthNow}-10';`,
		);

		for (let i = 0; i < results2.length; i++) {
			results2[i].ACTUAL_1 = 0;
			for (let j = 0; j < results3.length; j++) {
				if (
					results3[j].IDK == results2[i].IDK &&
					results3[j].GTYPE === results2[i].GTYPE
				) {
					results2[i].ACTUAL_1 += 1;
				}
			}
		}

		const [results4, metadata4] = await sequelize.query(
			`SELECT a.GTYPE, c.IDK
			FROM sbox.dbo.SBF03A a
			JOIN sbox.dbo.SBF03B b
			ON a.ID1 = b.ID1
			JOIN salmon2.dbo.SXT01A c
			ON b.VISIT_ID = c.VISIT_ID
			WHERE CONVERT(date, c.TGL) BETWEEN '${yearNow}-${monthNow}-11' AND '${yearNow}-${monthNow}-20';`,
		);

		for (let i = 0; i < results2.length; i++) {
			results2[i].ACTUAL_2 = 0;
			for (let j = 0; j < results4.length; j++) {
				if (
					results2[i].IDK == results4[j].IDK &&
					results2[i].GTYPE == results4[j].GTYPE
				) {
					results2[i].ACTUAL_2 += 1;
				}
			}
		}

		const [results5, metadata5] = await sequelize.query(
			`SELECT a.GTYPE, c.IDK
			FROM sbox.dbo.SBF03A a
			JOIN sbox.dbo.SBF03B b
			ON a.ID1 = b.ID1
			JOIN salmon2.dbo.SXT01A c
			ON b.VISIT_ID = c.VISIT_ID
			WHERE CONVERT(date, c.TGL) BETWEEN '${yearNow}-${monthNow}-21' AND '${yearNow}-${monthNow}-${lastDate}';`,
		);

		for (let i = 0; i < results2.length; i++) {
			results2[i].ACTUAL_3 = 0;
			for (let j = 0; j < results5.length; j++) {
				if (
					results2[i].IDK == results5[j].IDK &&
					results2[i].GTYPE == results5[j].GTYPE
				) {
					results2[i].ACTUAL_3 += 1;
				}
			}
		}

		const [results6, metadata6] = await sequelize.query(
			`SELECT a.COY_ID, b.GTYPE, b.BK${monthNow} FROM sbox.dbo.SBF05A a
			JOIN sbox.dbo.SBF05B b
			ON a.ID1 = b.ID1
			WHERE a.COY_ID = 1 AND a.THN = ${yearNow};`,
		);

		for (let i = 0; i < results2.length; i++) {
			results2[i].BUDGET = 0;
			for (let j = 0; j < results6.length; j++) {
				if (results2[i].GTYPE === results6[j].GTYPE) {
					results2[i].BUDGET = results6[j][`BK${monthNow}`];
				}
			}
		}

		for (let i = 0; i < results2.length; i++) {
			const percentage = Math.floor(
				(results2[i].TOTAL_COUNT / results2[i].BUDGET) * 100,
			);
			results2[i].PERCENTAGE = Number.isFinite(percentage) ? percentage : 0;
			let score = 0;
			let excess = 0;
			let excess_score = 0;
			if (percentage > 100) {
				excess = percentage - 100;
				score = 1;
				excess_score = 1.5;
			}
			if (percentage === 100) {
				score = 1;
			}
			if (percentage < 100 && percentage >= 80) {
				score = percentage / 100;
			}
			if (percentage < 80 && percentage >= 50) {
				score = 0.5;
			}
			const totalScore = parseInt(
				(
					score * results2[i].NILAI * results2[i].BUDGET +
					excess_score * excess * score * results2[i].BUDGET
				).toFixed(0),
			);
			results2[i].TOTAL_SCORE = Number.isFinite(totalScore) ? totalScore : 0;
		}

		res.json(global.getStandardResponse(0, "success", results2));
	} catch (err) {
		console.log(err);
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
