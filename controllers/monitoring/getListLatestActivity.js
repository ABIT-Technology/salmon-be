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

		let dailyActivity = [];
		console.log(lastDate);
		for (let i = 1; i <= lastDate; i++) {
			const [results2, metadata2] = await sequelize.query(
				`SELECT a.GTYPE, a.KET, a.NILAI, c.IDK, c.TGL, c.ID1, count(a.GTYPE) AS TOTAL_COUNT FROM sbox.dbo.SBF03A a
				JOIN sbox.dbo.SBF03B b
				ON a.ID1 = b.ID1
				JOIN salmon2.dbo.SXT01A c
				ON b.VISIT_ID = c.VISIT_ID
				WHERE c.IDK = ${req.query.IDK} AND c.STATUS = 1 
				AND CONVERT(date, c.TGL) = '${yearNow}-${monthNow}-${i}'
				GROUP BY a.GTYPE, a.KET, a.NILAI, c.IDK, C.TGL, c.ID1
				ORDER BY c.TGL DESC;`,
			);

			dailyActivity.push({
				ID: i,
				DATE: new Date(yearNow, monthNow - 1, i),
				DETAILS: results2[0] || null,
			});
		}

		res.json(global.getStandardResponse(0, "success", dailyActivity));
	} catch (err) {
		console.log(err);
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
