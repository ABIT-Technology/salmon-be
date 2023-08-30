const Joi = require("joi");
const { writeFileSync } = require("fs");
const crypto = require("crypto");

// const { AXT02B } = require("../../models");
const sequelizeSalmon = require("../../config/configdb");
const sequelizeSBOX = require("../../config/configdb2");
const global = require("../../config/global");

module.exports = async (req, res) => {
	try {
		const {
			KATEGORI_PENGOBATAN,
			INSTANSI_KESEHATAN,
			TANGGAL_NOTA,
			NAMA_PASIEN,
			BIAYA_PERIKSA,
			BIAYA_APOTEK,
			BIAYA_LABORATORIUM,
			BIAYA_TINDAKAN,
			NOMINAL_REIMBURSE,
			KETERANGAN_BUKTI_TRANSAKSI1, // table AXT02A
			KETERANGAN_BUKTI_TRANSAKSI2, // table AXT02A
		} = req.body;

		const schema = Joi.object({
			KATEGORI_PENGOBATAN: Joi.string().required(),
			INSTANSI_KESEHATAN: Joi.string().required(),
			TANGGAL_NOTA: Joi.date().required(),
			NAMA_PASIEN: Joi.string().required(),
			BIAYA_PERIKSA: Joi.number().required(),
			BIAYA_APOTEK: Joi.number().required(),
			BIAYA_LABORATORIUM: Joi.number().required(),
			BIAYA_TINDAKAN: Joi.number().required(),
			NOMINAL_REIMBURSE: Joi.number().required(),
			KETERANGAN_BUKTI_TRANSAKSI1: Joi.string().required(), // table AXT02A
			KETERANGAN_BUKTI_TRANSAKSI2: Joi.string().required(), // table AXT02A
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

		// const [results1, metadata1] = await sequelizeSBOX.query(
		// 	`SELECT * FROM SBF01A WHERE IDK = ${req.user.IDK};`,
		// );

		// if (results1.length <= 0) {
		// 	return res.status(404).send({
		// 		code: 404,
		// 		message: "User not found",
		// 	});
		// }

		// const [results2, metadata2] = await sequelizeSalmon.query(
		// 	`SELECT * FROM vwABF02A WHERE IDK = ${req.user.IDK};`,
		// );

		const t = await sequelizeSalmon.transaction();
		try {
			const sql = `INSERT INTO AXT01A (
				JTRAN, 
				INSTANSI, 
				TGL_NOTA,
				PASIEN,
				BIAYA_PERIKSA,
				BIAYA_APOTEK,
				BIAYA_LABORATORIUM,
				BIAYA_TINDAKAN,
				NOMINAL_REIMBURSE,
				TGL_INPUT,
				USER_INPUT,
			) VALUES (
				'${KATEGORI_PENGOBATAN}',
				'${INSTANSI_KESEHATAN}',
				'${TANGGAL_NOTA}',
				'${NAMA_PASIEN}',
				'${BIAYA_PERIKSA}',
				'${BIAYA_APOTEK}',
				'${BIAYA_LABORATORIUM}',
				'${BIAYA_TINDAKAN}',
				'${NOMINAL_REIMBURSE}',
				'${new Date()}',
				'HARDI' 
			)`;

			const sqlInsertMedical = await sequelizeSalmon.query(sql);

			const [lastInsert, metadata3] = await sequelizeSalmon.query(
				`SELECT TOP 1 * FROM AXT01A ORDER BY ID1 DESC;`,
			);

			if (KETERANGAN_BUKTI_TRANSAKSI1) {
				const sqlBuktiKeterangan1 = `INSERT INTO AXT01B (
					ID2
					FILE_NAME,
					KET,
					TGL_INPUT,
					USER_INPUT
				) VALUES (
					'${lastInsert[ID1]}',
					'',
					'${KETERANGAN_BUKTI_TRANSAKSI1}',
					'${new Date()}',
					'HARDI'
				)`;

				const sqlInsertBukti1 = await sequelizeSalmon.query(
					sqlBuktiKeterangan1,
				);
			}

			if (KETERANGAN_BUKTI_TRANSAKSI2) {
				const sqlBuktiKeterangan1 = `INSERT INTO AXT01B (
					ID2,
					FILE_NAME,
					KET,
					TGL_INPUT,
					USER_INPUT
				) VALUES (
					'${lastInsert[ID1]}',
					'',
					'${KETERANGAN_BUKTI_TRANSAKSI1}',
					'${new Date()}',
					'HARDI'
				)`;

				const sqlInsertBukti2 = await sequelizeSalmon.query(
					sqlBuktiKeterangan1,
				);
			}

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
