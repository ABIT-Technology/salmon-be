const Joi = require("joi");
const { writeFileSync } = require("fs");
const crypto = require("crypto");

const { AXT02B } = require("../../models");
const sequelizeSalmon = require("../../config/configdb");
const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = async (req, res) => {
	try {
		const schema = Joi.object({
			BUKTI: Joi.string().allow("", null).required(),
			TGL: Joi.date().required(),
			CUTI_: Joi.number().required(),
			DR_TGL: Joi.date().required(),
			SD_TGL: Joi.date().required(),
			CUTI_SALDO: Joi.number().required(),
			CUTI_AMBIL: Joi.number().required(),
			AMBIL: Joi.number().required(),
			KET: Joi.string().allow("", null).required(),
			NO_BUKTI: Joi.string().required(),
			DETAIL_CUTI: Joi.array()
				.items(
					Joi.object({
						WKT1: Joi.date().required(),
						WKT2: Joi.date().required(),
						HARI: Joi.number().required(),
						KET: Joi.string().allow("", null).required(),
					}),
				)
				.required(),
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

		const [results1, metadata1] = await sequelizeSBOX.query(
			`SELECT * FROM SBF01A WHERE IDK = ${req.user.IDK};`,
		);

		if (results1.length <= 0) {
			return res.status(404).send({
				code: 404,
				message: "User not found",
			});
		}

		const [results2, metadata2] = await sequelizeSalmon.query(
			`SELECT * FROM vwABF02A WHERE IDK = ${req.user.IDK};`,
		);
		console.log(req.body);
		const t = await sequelizeSalmon.transaction();
		try {
			const sql = `INSERT INTO AXT02A(BUKTI,TGL,IDK,CUTI_,DR_TGL,SD_TGL,CUTI_SALDO,
				CUTI_AMBIL,AMBIL,KET,NO_BUKTI,USER_INPUT)
				values('${req.body.BUKTI}','${req.body.TGL}','${req.user.IDK}',
				'${req.body.CUTI_}','${req.body.DR_TGL}','${req.body.SD_TGL}',
				'${req.body.CUTI_SALDO}','${req.body.CUTI_AMBIL}','${req.body.AMBIL}',
				'${req.body.KET}','${req.body.NO_BUKTI}','${results2[0].NAMA}');`;
			const insert1 = await sequelizeSalmon
				.query(sql, {
					type: sequelizeSalmon.QueryTypes.INSERT,
					transaction: t,
				})
				.then(function () {
					const results2 = sequelizeSalmon.query(
						"SELECT TOP 1 * FROM AXT02A WHERE IDK = '" +
							req.user.IDK +
							"' ORDER BY ID1 DESC",
						{ type: sequelizeSalmon.QueryTypes.SELECT, transaction: t },
					);
					if (results2 != null) {
						return results2;
					}
				});
			const ID1 = insert1[0]["ID1"];
			// for (let i = 0; i < req.body.DETAIL_CUTI.length; i++) {
			// 	req.body.DETAIL_CUTI[i].ID1 = ID1;
			// 	req.body.DETAIL_CUTI[i].CUTI_ = req.body.CUTI_;
			// 	req.body.DETAIL_CUTI[i].TGL = req.body.TGL;
			// 	req.body.DETAIL_CUTI[i].USER_INPUT = results2[0].NAMA;
			// 	req.body.DETAIL_CUTI[i].CUTI_KE = 0;
			// }
			// await AXT02B.bulkCreate(req.body.DETAIL_CUTI, {
			// 	transaction: t,
			// });
			// // CSV is formatted in the following format
			// /*
			// 	column1, column2, column3
			// 	value1, value2, value3
			// 	value1, value2, value
			// */
			// const dataCSV = req.body.DETAIL_CUTI.reduce(
			// 	(acc, data) => {
			// 		console.log(acc);
			// 		acc += `${parseInt(data.ID1)},${data.CUTI_},${data.TGL},${
			// 			data.WKT1
			// 		},${data.WKT2},${parseFloat(data.HARI)},${data.KET},${
			// 			data.USER_INPUT
			// 		}\n`;
			// 		return acc;
			// 	},
			// 	`ID1,CUTI_,TGL,WKT1,WKT2,HARI,KET,USER_INPUT\n`, // column names for csv
			// );

			// const filename = crypto.randomUUID();
			// const filepath = "./public/upload/tempFiles/" + filename + ".csv";
			// // write csv content to a file using Node's fs module
			// writeFileSync("mya.csv", dataCSV, "utf8");

			// let sql2 = `INSERT INTO AXT02B
			// 			FROM ${process.cwd()}\\mya.csv
			// 			WITH (
			// 				FIELDTERMINATOR = ',',
			// 				ROWTERMINATOR = '\n',
			// 				FIRSTROW = 2,
			// 				FORMAT = 'CSV'
			// 			);`;
			// let sql2 = `BULK INSERT AXT02B
			// 			FROM ${process.cwd()}\\mya.csv
			// 			WITH (
			// 				FIELDTERMINATOR = ',',
			// 				ROWTERMINATOR = '\n',
			// 				FIRSTROW = 2,
			// 				FORMAT = 'CSV'
			// 			);`;
			for (let index = 0; index < req.body.DETAIL_CUTI.length; index++) {
				const sql2 = `INSERT INTO AXT02B(ID1,CUTI_,TGL,WKT1,WKT2,HARI,KET,USER_INPUT)
					values('${ID1}','${req.body.CUTI_}','${req.body.TGL}',
					'${req.body.DETAIL_CUTI[index].WKT1}','${req.body.DETAIL_CUTI[index].WKT2}',
					'${req.body.DETAIL_CUTI[index].HARI}','${req.body.DETAIL_CUTI[index].KET}',
					'${results2[0].NAMA}');`;
				await sequelizeSalmon.query(sql2, {
					type: sequelizeSalmon.QueryTypes.INSERT,
					transaction: t,
				});
			}

			console.log(2);
			await t.commit();
			res.json(global.getStandardResponse(0, "success", null));
		} catch (error) {
			await t.rollback();
			return res
				.status(500)
				.json(
					global.getStandardResponse(500, error?.message || "API error", null),
				);
		}
	} catch (err) {
		console.log("err", err);
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
