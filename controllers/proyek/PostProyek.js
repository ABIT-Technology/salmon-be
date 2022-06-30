const Joi = require("joi");
const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const { SBF01A } = require("../../models");

module.exports = {
    SubmitProyek: async (req, res) => {
        const schema = Joi.object({
            ID1: Joi.number().required(),
            LAT_: Joi.number().required(),
            LONG_: Joi.number().required(),
            SPEED: Joi.number().required(),
            TGL: Joi.string().required(),
            TGL_INPUT: Joi.string().required(),
            SIGNAL: Joi.number().required(),
            BATTERY: Joi.number().required(),
            KET: Joi.string().required().allow(null, ""),
            VISIT_ID: Joi.string().required().allow(null, ""),
            ALTITUDE: Joi.number().required(),
            ACCURATE: Joi.number().required(),
            LOKASI: Joi.string().required(),
            product: Joi.array().required(),
            crops: Joi.array().required(),
            media: Joi.array().required(),
            image: Joi.array().required(),
            ID3_REF: Joi.string().allow(null, "")
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

        const t = await sequelize.transaction();
        try {
            let ID1_REF = null;
            // if (req.body.ID1 != undefined) {
            const reskegiatan = await sequelize.query("select * from SXT02A a left join SXT02B b on a.ID1 = b.ID1"
                + " where b.IDK = " + req.user.IDK + " AND a.ID1='" + req.body.ID1 + "'");
            if (reskegiatan != null) {
                try {
                    ID1_REF = reskegiatan[0][0].ID1;
                }
                catch {
                    return res.status(409).send({
                        code: 409,
                        message: "Project not authorized",
                    });
                }
            }
            else {
                return res.status(409).send({
                    code: 409,
                    message: "Project not authorized",
                });
            }
            // }


            let ID3_REF = null;
            if (req.body.ID3_REF != undefined) {
                const reskegiatan = await sequelize.query("SELECT TOP 1 * FROM SXT02C WHERE ID3='" + req.body.ID3_REF + "'");
                if (reskegiatan != null) {
                    ID3_REF = req.body.ID3_REF;
                }
            }
            // GET COY_ID from current login user
            let COY_ID = 0;

            const [results, metadata] = await sequelize.query("SELECT TOP 1 * FROM ABF02A WHERE AKTIF = 1 AND IDK='" + req.user.IDK + "'");
            if (results != null) {
                COY_ID = results[0]['COY_ID'];
            }

            // save table header transaksi kegiatan
            const sql = "INSERT INTO SXT02C(ID1,IDK,LAT_,LONG_,SPEED,TGL,TGL_INPUT,SIGNAL,BATTERY,KET,COY_ID,VISIT_ID,TYPE,ALTITUDE"
                + ",ACCURATE,LOKASI,ID3_REF) values(" + (ID1_REF == null ? "NULL" : ID1_REF) + ",'"
                + req.user.IDK + "','" + req.body.LAT_ + "','" + req.body.LONG_ + "','" + req.body.SPEED
                + "','" + req.body.TGL + "',GETDATE(),'" + req.body.SIGNAL + "','" + req.body.BATTERY + "','"
                + req.body.KET + "','" + COY_ID + "','" + req.body.VISIT_ID + "',0,'" + req.body.ALTITUDE + "','" + req.body.ACCURATE +
                "','" + req.body.LOKASI + "'," + (ID3_REF == null ? "NULL" : ID3_REF) + ")";
            let header = await sequelize.query(sql, {
                type: sequelize.QueryTypes.INSERT,
            }).then(function () {
                const results2 = sequelize.query("SELECT TOP 1 * FROM SXT02C ORDER BY ID1 DESC");
                if (results2 != null) {
                    return results2;
                    // console.log(results2);
                }
            });
            let headerid = header[0][0]['ID3'];
            // console.log(headerid);
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
            for (let i = 0; i < product.length; i++) {

                if (schemaproduct.validate(product[i]).error) {
                    throw new Error(schemaproduct.validate(product[i]).error);
                }
                const sqlprod = "INSERT INTO SXT02D(ID1,ID3,BRG,QTY,STN,TGL_INPUT) VALUES(" + (ID1_REF == null ? "NULL" : ID1_REF) + ",'"
                    + headerid + "','" + product[i]["BRG"] + "','" + product[i]["QTY"] + "','"
                    + product[i]["STN"] + "',GETDATE())";
                sequelize.query(sqlprod, {
                    type: sequelize.QueryTypes.INSERT
                });
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
            for (let i = 0; i < media.length; i++) {
                if (schemamedia.validate(media[i]).error) {
                    throw new Error(schemamedia.validate(media[i]).error);
                }
                const sqlmedia = "INSERT INTO SXT02E(ID1,ID3,MEDIA,QTY,TGL_INPUT) VALUES(" + (ID1_REF == null ? "NULL" : ID1_REF) + ",'"
                    + headerid + "','" + media[i]["MEDIA"] + "','" + media[i]["QTY"] + "',GETDATE())";
                sequelize.query(sqlmedia, {
                    type: sequelize.QueryTypes.INSERT
                });
                console.log(media[i]["nama"]);
            }
            // end of media promosi

            // save crops
            let crops = req.body.crops;
            const schemacrops = Joi.object({
                CROPS: Joi.string().required(),
            }).options({
                allowUnknown: false,
            });
            for (let i = 0; i < crops.length; i++) {
                if (schemacrops.validate(crops[i]).error) {
                    throw new Error(schemacrops.validate(crops[i]).error);
                }
                const sqlcrops = "INSERT INTO SXT02F(ID1,ID3,CROPS,TGL_INPUT) VALUES(" + (ID1_REF == null ? "NULL" : ID1_REF) + ",'"
                    + headerid + "','" + crops[i]["CROPS"] + "',GETDATE())";
                sequelize.query(sqlcrops, {
                    type: sequelize.QueryTypes.INSERT
                });
            }
            // end of save crops

            // save image
            let image = req.body.image;
            for (let i = 0; i < image.length; i++) {
                let imagefilename = global.uploadBase64Image(image[i]);

                const sqlcrops = "INSERT INTO SXT02G(ID1,ID3,PHOTO,TGL_INPUT,USER_INPUT) VALUES(" + (ID1_REF == null ? "NULL" : ID1_REF) + ",'"
                    + headerid + "','" + imagefilename + "',GETDATE(),'" + req.user.IDK + "')";
                sequelize.query(sqlcrops, {
                    type: sequelize.QueryTypes.INSERT
                });
            }
            // end of image

            await t.commit();
            res.json(global.getStandardResponse(0, "success : proyek saved", null));

        }
        catch (err) {
            await t.rollback();
            res.status(500).json(global.getStandardResponse(500, "API error : " + err.message, null));
        }
    },

    ViewDetailProyek: async (req, res) => {
        try {
            let json = [];
            const [results, metadata] = await sequelize.query("SELECT * FROM SXT02C WHERE ID3 ='" + req.body.ID3 + "'");
            if (results != null) {
                json = results;
                const [results2, metadata2] = await sequelize.query("SELECT * FROM SXT02D WHERE ID3 ='" + req.body.ID3 + "'");
                if (results2 != null) {
                    json[0].PRODUCT = results2;
                }
                const [results3, metadata3] = await sequelize.query("SELECT * FROM SXT02E WHERE ID3 ='" + req.body.ID3 + "'");
                if (results3 != null) {
                    json[0].MEDIA = results3;
                }
                const [results4, metadata4] = await sequelize.query("SELECT * FROM SXT02F WHERE ID3 ='" + req.body.ID3 + "'");
                if (results4 != null) {
                    json[0].CROPS = results4;
                }
                const [results5, metadata5] = await sequelize.query("SELECT * FROM SXT02G WHERE ID3 ='" + req.body.ID3 + "'");
                if (results5 != null) {
                    json[0].IMAGES = results5;
                }
            }
            res.json(global.getStandardResponse(0, "success : get data proyek", json));
        }
        catch (err) {
            res.status(500).json(global.getStandardResponse(500, "API error : " + err.message, null));
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
            const results = await sequelize.query("select TOP 1 * from SXT01A where IDK = " + req.user.IDK + " and ID1_REF IS NOT NULL AND ID1_REF != 0 and ID1_REF NOT IN(" +
                " select distinct ID1_REF" +
                " from SXT01A " +
                " where IDK = " + req.user.IDK + " and ID1_REF in ( select ID1 from SXT01A where IDK = " + req.user.IDK + ") " +
                " and ISNULL(VISIT_ID, '') = ( SELECT TOP 1 VISIT_ID from ref_SXF03 where COY_ID = (select COY_ID from ABF02A where IDK = " + req.user.IDK + "))) ORDER BY ID1 DESC");
            if (results != null) {
                json = results;
                console.log(json);
                const [results2, metadata2] = await sequelize.query("SELECT * FROM SXT01B WHERE ID1 ='" + json[0][0].ID1 + "'");
                if (results2 != null) {
                    json[0].PRODUCT = results2;
                }
                const [results3, metadata3] = await sequelize.query("SELECT * FROM SXT01C WHERE ID1 ='" + json[0][0].ID1 + "'");
                if (results3 != null) {
                    json[0].MEDIA = results3;
                }
                const [results4, metadata4] = await sequelize.query("SELECT * FROM SXT01C WHERE ID1 ='" + json[0][0].ID1 + "'");
                if (results4 != null) {
                    json[0].CROPS = results4;
                }
                const [results5, metadata5] = await sequelize.query("SELECT * FROM SXT01C WHERE ID1 ='" + json[0][0].ID1 + "'");
                if (results5 != null) {
                    json[0].IMAGES = results5;
                }
            }
            res.json(global.getStandardResponse(0, "success", results));

        }
        catch (err) {
            res.status(500).json(global.getStandardResponse(500, "API error : " + err.message, null));
        }
    }
    // FinishKegiatan: async (req, res) => {
    //     try {
    //         const sql = "UPDATE SXT01A SET STATUS = 1 WHERE ID1 = '" + req.body.ID1 + "'";
    //         sequelize.query(sql, {
    //             type: sequelize.QueryTypes.UPDATE,
    //         }).then(function () {
    //                 res.json(global.getStandardResponse(0, "success : update status kegiatan", null));
    //         });
    //     }
    //     catch (err) {
    //         res.status(500).json(global.getStandardResponse(500, "API error : " + err.message, null));
    //     }
    // }
}