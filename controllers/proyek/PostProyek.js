const Joi = require("joi");
const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const { SBF01A } = require("../../models");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = {
	SubmitProyek: async (req, res) => {
		const schema = Joi.object({
			ID1: Joi.number().required(),
			LAT_: Joi.number().required(),
			LONG_: Joi.number().required(),
			COURSE: Joi.number().required(),
			SPEED: Joi.number().required(),
			TGL: Joi.string().required(),
			TGL_INPUT: Joi.string().required(),
			SIGNAL: Joi.number().required(),
			BATTERY: Joi.number().required(),
			KET: Joi.string().allow(null, ""),
			VISIT_ID: Joi.string().allow(null, ""),
			ALTITUDE: Joi.number().required(),
			ACCURATE: Joi.number().required(),
			LOKASI: Joi.string().required(),
			product: Joi.array().allow(null, ""),
			crops: Joi.array().allow(null, ""),
			media: Joi.array().allow(null, ""),
			image: Joi.array().required(),
			ID3_REF: Joi.number().allow(null, ""),
			MID3: Joi.string().required(),
			MID3_REF: Joi.string().allow(null, ""),
			STATUS: Joi.boolean().allow(null, ""),
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

		const t = await sequelize.transaction();
		try {
			let VISIT_ID = 0;
			let status = 0;
			if (req.body.STATUS != undefined) {
				if (req.body.STATUS) {
					const resvisitid = await sequelize.query(
						"select DEF_CHECKOUT from SXFSYS WHERE BLN = MONTH(GETDATE()) AND THN = YEAR(GETDATE())",
					);
					try {
						VISIT_ID = resvisitid[0][0].DEF_CHECKOUT;
						status = 1;
					} catch {}
				}
			}

			let ID1_REF = null;
			// if (req.body.ID1 != undefined) {
			const reskegiatan = await sequelize.query(
				"select * from SXT02A a left join SXT02B b on a.ID1 = b.ID1" +
					" where b.IDK = " +
					req.user.IDK +
					" AND a.ID1='" +
					req.body.ID1 +
					"'",
			);
			if (reskegiatan != null) {
				try {
					ID1_REF = reskegiatan[0][0].ID1;
				} catch {
					return res.status(409).send({
						code: 409,
						message: "Project not authorized",
					});
				}
			} else {
				return res.status(409).send({
					code: 409,
					message: "Project not authorized",
				});
			}
			// }

			let ID3_REF = null;
			if (req.body.ID3_REF != undefined) {
				const reskegiatan = await sequelize.query(
					"SELECT TOP 1 * FROM SXT02C WHERE ID3='" + req.body.ID3_REF + "'",
				);
				if (reskegiatan != null) {
					ID3_REF = req.body.ID3_REF;
				}
			}
			// GET COY_ID from current login user
			let COY_ID = 0;

			const [results, metadata] = await sequelize.query(
				"SELECT TOP 1 * FROM vwABF02A WHERE AKTIF = 1 AND IDK='" +
					req.user.IDK +
					"'",
			);
			if (results != null) {
				COY_ID = results[0]["COY_ID"];
			}

			// save table header transaksi kegiatan
			const sql =
				"INSERT INTO SXT02C(ID1,IDK,LAT_,LONG_,COURSE,SPEED,TGL,TGL_INPUT,SIGNAL,BATTERY,KET,COY_ID,VISIT_ID,TYPE,ALTITUDE" +
				",ACCURATE,LOKASI,ID3_REF,MID3,MID3_REF,STATUS) values(" +
				(ID1_REF == null ? "NULL" : ID1_REF) +
				",'" +
				req.user.IDK +
				"','" +
				req.body.LAT_ +
				"','" +
				req.body.LONG_ +
				"','" +
				req.body.COURSE +
				"','" +
				req.body.SPEED +
				"','" +
				req.body.TGL +
				"',GETDATE(),'" +
				req.body.SIGNAL +
				"','" +
				req.body.BATTERY +
				"'," +
				(req.body.KET == null ? "NULL" : "'" + req.body.KET + "'") +
				",'" +
				COY_ID +
				"','" +
				(VISIT_ID == 0 ? req.body.VISIT_ID : VISIT_ID) +
				"',0,'" +
				req.body.ALTITUDE +
				"','" +
				req.body.ACCURATE +
				"','" +
				req.body.LOKASI +
				"'," +
				(ID3_REF == null ? "NULL" : ID3_REF) +
				",'" +
				req.body.MID3 +
				"','" +
				(req.body.MID3_REF == null || req.body.MID3_REF == ""
					? "NULL"
					: req.body.MID3_REF) +
				"'," +
				1 +
				")";
			let header = await sequelize
				.query(sql, {
					type: sequelize.QueryTypes.INSERT,
					transaction: t,
				})
				.then(function () {
					const results2 = sequelize.query(
						"SELECT TOP 1 * FROM SXT02C ORDER BY ID3 DESC",
						{ transaction: t },
					);
					if (results2 != null) {
						return results2;
					}
				});
			let headerid = header[0][0]["ID3"];
			// end of save table header transaksi kegiatan

			// save product
			let product = req.body.product;
			const schemaproduct = Joi.object({
				BRG: Joi.string().required(),
				QTY: Joi.number().required(),
				STN: Joi.number().required(),
			}).options({
				allowUnknown: false,
			});
			if (product != undefined) {
				for (let i = 0; i < product.length; i++) {
					if (schemaproduct.validate(product[i]).error) {
						throw new Error(schemaproduct.validate(product[i]).error);
					}
					const sqlprod =
						"INSERT INTO SXT02D(ID1,ID3,BRG,QTY,STN,TGL_INPUT) VALUES(" +
						(ID1_REF == null ? "NULL" : ID1_REF) +
						",'" +
						headerid +
						"','" +
						product[i]["BRG"] +
						"','" +
						product[i]["QTY"] +
						"','" +
						2 +
						"',GETDATE())";
					await sequelize.query(sqlprod, {
						type: sequelize.QueryTypes.INSERT,
						transaction: t,
					});
				}
			}
			// end of save product

			// save media promosi
			let media = req.body.media;
			const schemamedia = Joi.object({
				MEDIA: Joi.string().required(),
				QTY: Joi.number().required(),
			}).options({
				allowUnknown: false,
			});
			if (media != undefined) {
				for (let i = 0; i < media.length; i++) {
					if (schemamedia.validate(media[i]).error) {
						throw new Error(schemamedia.validate(media[i]).error);
					}
					const sqlmedia =
						"INSERT INTO SXT02E(ID1,ID3,MEDIA,QTY,TGL_INPUT) VALUES(" +
						(ID1_REF == null ? "NULL" : ID1_REF) +
						",'" +
						headerid +
						"','" +
						media[i]["MEDIA"] +
						"','" +
						media[i]["QTY"] +
						"',GETDATE())";
					await sequelize.query(sqlmedia, {
						type: sequelize.QueryTypes.INSERT,
						transaction: t,
					});
				}
			}
			// end of media promosi

			// save crops
			let crops = req.body.crops;
			const schemacrops = Joi.object({
				CROPS: Joi.string().required(),
			}).options({
				allowUnknown: false,
			});
			if (crops != undefined) {
				for (let i = 0; i < crops.length; i++) {
					if (schemacrops.validate(crops[i]).error) {
						throw new Error(schemacrops.validate(crops[i]).error);
					}
					const sqlcrops =
						"INSERT INTO SXT02F(ID1,ID3,CROPS,TGL_INPUT) VALUES(" +
						(ID1_REF == null ? "NULL" : ID1_REF) +
						",'" +
						headerid +
						"','" +
						crops[i]["CROPS"] +
						"',GETDATE())";
					await sequelize.query(sqlcrops, {
						type: sequelize.QueryTypes.INSERT,
						transaction: t,
					});
				}
			}
			// end of save crops

			// save image
			let image = req.body.image;
			if (image != undefined) {
				for (let i = 0; i < image.length; i++) {
					let imagefilename = global.uploadBase64Image(image[i]);

					const sqlcrops =
						"INSERT INTO SXT02G(ID1,ID3,PHOTO,TGL_INPUT,USER_INPUT) VALUES(" +
						(ID1_REF == null ? "NULL" : ID1_REF) +
						",'" +
						headerid +
						"','" +
						imagefilename +
						"',GETDATE(),'" +
						req.user.IDK +
						"')";
					await sequelize.query(sqlcrops, {
						type: sequelize.QueryTypes.INSERT,
						transaction: t,
					});
				}
			}
			// end of image

			await t.commit();
			res.json(global.getStandardResponse(0, "success : proyek saved", null));
		} catch (err) {
			await t.rollback();
			res
				.status(500)
				.json(
					global.getStandardResponse(500, "API error : " + err.message, null),
				);
		}
	},

	ViewDetailProyek: async (req, res) => {
		try {
			const user = await SBF01A.findOne({
				where: { IDK: req.user.IDK },
				raw: true,
			});

			if (!user) {
				return res.status(409).send({
					code: 409,
					message: "User not authorized",
				});
			}

			let json = [];
			const [results, metadata] = await sequelize.query(
				"SELECT * FROM SXT02C WHERE ID3 ='" + req.body.ID3 + "'",
			);
			if (results != null) {
				json = results;
				const [results2, metadata2] = await sequelize.query(
					"SELECT * FROM SXT02D WHERE ID3 ='" + req.body.ID3 + "'",
				);
				if (results2 != null) {
					json[0].PRODUCT = results2;
				}
				const [results3, metadata3] = await sequelize.query(
					"SELECT * FROM SXT02E WHERE ID3 ='" + req.body.ID3 + "'",
				);
				if (results3 != null) {
					json[0].MEDIA = results3;
				}
				const [results4, metadata4] = await sequelize.query(
					"SELECT * FROM SXT02F WHERE ID3 ='" + req.body.ID3 + "'",
				);
				if (results4 != null) {
					json[0].CROPS = results4;
				}
				const [results5, metadata5] = await sequelize.query(
					"SELECT * FROM SXT02G WHERE ID3 ='" + req.body.ID3 + "'",
				);
				if (results5 != null) {
					json[0].IMAGES = results5;
				}
			}
			res.json(
				global.getStandardResponse(0, "success : get data proyek", json),
			);
		} catch (err) {
			res
				.status(500)
				.json(
					global.getStandardResponse(500, "API error : " + err.message, null),
				);
		}
	},

	ViewUnfinishedProyek: async (req, res) => {
		try {
			const user = await SBF01A.findOne({
				where: { IDK: req.user.IDK },
				raw: true,
			});

			if (!user) {
				return res.status(409).send({
					code: 409,
					message: "User not authorized",
				});
			}
			let json = [];
			// const results = await sequelize.query("select TOP 1 * from SXT02C where IDK = " + req.user.IDK + " AND ID3_REF NOT IN(" +
			//     " select distinct ID3_REF" +
			//     " from SXT02C " +
			//     " where IDK = " + req.user.IDK + " and ID3_REF in ( select ID3 from SXT02C where IDK = " + req.user.IDK + ") " +
			//     " and ISNULL(VISIT_ID, '') = ( SELECT TOP 1 VISIT_ID from ref_SXF03P where COY_ID = (select COY_ID from ABF02A where IDK = " + req.user.IDK + "))) ORDER BY ID3 DESC");
			const results = await sequelize.query(
				"select TOP 1 * from SXT02C where IDK = " +
					req.user.IDK +
					" AND ISNULL(ID3_REF,ID3) " +
					"not in ( select ISNULL(ID3_REF,ID3) from SXT02C where status = 1 ) order by ID3 desc",
			);
			if (results != null) {
				json = results;
				const [results2, metadata2] = await sequelize.query(
					"SELECT * FROM SXT02D WHERE ID1 ='" + json[0][0].ID3 + "'",
				);
				if (results2 != null) {
					json[0].PRODUCT = results2;
				}
				const [results3, metadata3] = await sequelize.query(
					"SELECT * FROM SXT02E WHERE ID1 ='" + json[0][0].ID3 + "'",
				);
				if (results3 != null) {
					json[0].MEDIA = results3;
				}
				const [results4, metadata4] = await sequelize.query(
					"SELECT * FROM SXT02F WHERE ID1 ='" + json[0][0].ID3 + "'",
				);
				if (results4 != null) {
					json[0].CROPS = results4;
				}
				const [results5, metadata5] = await sequelize.query(
					"SELECT * FROM SXT02G WHERE ID1 ='" + json[0][0].ID3 + "'",
				);
				if (results5 != null) {
					json[0].IMAGES = results5;
				}
			}
			res.json(global.getStandardResponse(0, "success", results));
		} catch (err) {
			res
				.status(500)
				.json(
					global.getStandardResponse(500, "API error : " + err.message, null),
				);
		}
	},
	FinishProyek: async (req, res) => {
		try {
			const schema = Joi.object({
				ID3: Joi.string().required(),
				KET: Joi.string().required().allow(null, ""),
				LOKASI: Joi.string().required().allow(null, ""),
				product: Joi.array().allow(null, ""),
				crops: Joi.array().allow(null, ""),
				media: Joi.array().allow(null, ""),
				image: Joi.array().allow(null, ""),
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

			const user = await SBF01A.findOne({
				where: { IDK: req.user.IDK },
				raw: true,
			});

			if (!user) {
				return res.status(409).send({
					code: 409,
					message: "User not authorized",
				});
			}

			let ID1_REF = null;
			// if (req.body.ID1 != undefined) {
			const reskegiatan = await sequelize.query(
				"select * from SXT02C " + " where ID3 = " + req.body.ID3,
			);
			if (reskegiatan != null) {
				try {
					ID1_REF = reskegiatan[0][0].ID1;
				} catch {
					return res.status(409).send({
						code: 409,
						message: "Project not found",
					});
				}
			} else {
				return res.status(409).send({
					code: 409,
					message: "Project not found",
				});
			}
			// }

			const sql =
				"UPDATE SXT02C SET STATUS = 1, " +
				"KET = " +
				(req.body.KET == null ? "NULL" : "'" + req.body.KET + "'") +
				", LOKASI = " +
				(req.body.LOKASI == null ? "NULL" : "'" + req.body.LOKASI + "'") +
				" WHERE ID3 = '" +
				req.body.ID3 +
				"'";
			sequelize
				.query(sql, {
					type: sequelize.QueryTypes.UPDATE,
				})
				.then(function () {
					// save product
					let product = req.body.product;
					const schemaproduct = Joi.object({
						BRG: Joi.string().required(),
						QTY: Joi.number().required(),
						STN: Joi.number().required(),
					}).options({
						allowUnknown: false,
					});
					if (product != undefined) {
						for (let i = 0; i < product.length; i++) {
							if (schemaproduct.validate(product[i]).error) {
								throw new Error(schemaproduct.validate(product[i]).error);
							}
							const sqlprod =
								"INSERT INTO SXT02D(ID1,ID3,BRG,QTY,STN,TGL_INPUT) VALUES(" +
								(ID1_REF == null ? "NULL" : ID1_REF) +
								",'" +
								req.body.ID3 +
								"','" +
								product[i]["BRG"] +
								"','" +
								product[i]["QTY"] +
								"','" +
								2 +
								"',GETDATE())";
							sequelize.query(sqlprod, {
								type: sequelize.QueryTypes.INSERT,
							});
						}
					}
					// end of save product

					// save media promosi
					let media = req.body.media;
					const schemamedia = Joi.object({
						MEDIA: Joi.string().required(),
						QTY: Joi.number().required(),
					}).options({
						allowUnknown: false,
					});
					if (media != undefined) {
						for (let i = 0; i < media.length; i++) {
							if (schemamedia.validate(media[i]).error) {
								throw new Error(schemamedia.validate(media[i]).error);
							}
							const sqlmedia =
								"INSERT INTO SXT02E(ID1,ID3,MEDIA,QTY,TGL_INPUT) VALUES(" +
								(ID1_REF == null ? "NULL" : ID1_REF) +
								",'" +
								req.body.ID3 +
								"','" +
								media[i]["MEDIA"] +
								"','" +
								media[i]["QTY"] +
								"',GETDATE())";
							sequelize.query(sqlmedia, {
								type: sequelize.QueryTypes.INSERT,
							});
						}
					}
					// end of media promosi

					// save crops
					let crops = req.body.crops;
					const schemacrops = Joi.object({
						CROPS: Joi.string().required(),
					}).options({
						allowUnknown: false,
					});
					if (crops != undefined) {
						for (let i = 0; i < crops.length; i++) {
							if (schemacrops.validate(crops[i]).error) {
								throw new Error(schemacrops.validate(crops[i]).error);
							}
							const sqlcrops =
								"INSERT INTO SXT02F(ID1,ID3,CROPS,TGL_INPUT) VALUES(" +
								(ID1_REF == null ? "NULL" : ID1_REF) +
								",'" +
								req.body.ID3 +
								"','" +
								crops[i]["CROPS"] +
								"',GETDATE())";
							sequelize.query(sqlcrops, {
								type: sequelize.QueryTypes.INSERT,
							});
						}
					}
					// end of save crops

					// save image
					let image = req.body.image;
					if (image != undefined) {
						for (let i = 0; i < image.length; i++) {
							let imagefilename = global.uploadBase64Image(image[i]);

							const sqlcrops =
								"INSERT INTO SXT02G(ID1,ID3,PHOTO,TGL_INPUT,USER_INPUT) VALUES(" +
								(ID1_REF == null ? "NULL" : ID1_REF) +
								",'" +
								req.body.ID3 +
								"','" +
								imagefilename +
								"',GETDATE(),'" +
								req.user.IDK +
								"')";
							sequelize.query(sqlcrops, {
								type: sequelize.QueryTypes.INSERT,
							});
						}
					}
					// end of image

					res.json(
						global.getStandardResponse(
							0,
							"success : update status proyek",
							null,
						),
					);
				});
		} catch (err) {
			res
				.status(500)
				.json(
					global.getStandardResponse(500, "API error : " + err.message, null),
				);
		}
	},
};
