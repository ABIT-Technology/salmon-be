const Joi = require("joi");
const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const { SBF01A } = require("../../models");

module.exports = {
    SubmitKegiatan: async (req, res) => {
        const schema = Joi.object({
            LAT_: Joi.number().required(),
            LONG_: Joi.number().required(),
            COURSE: Joi.number().required(),
            SPEED: Joi.number().required(),
            TGL: Joi.string().required(),
            TGL_INPUT: Joi.string().required(),
            SIGNAL: Joi.number().required(),
            BATTERY: Joi.number().required(),
            KET: Joi.string().required().allow(null, ""),
            COY_ID: Joi.string().required().allow(null, ""),
            VISIT_ID: Joi.string().required().allow(null, ""),
            ALTITUDE: Joi.number().required(),
            ACCURATE: Joi.number().required(),
            CUST: Joi.string().required().allow(null, ""),
            LOKASI: Joi.string().required(),
            product: Joi.array().required(),
            crops: Joi.array().required(),
            media: Joi.array().required(),
            image: Joi.array().required(),
            ID1_REF: Joi.string().allow(null, "")
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
            if (req.body.ID1_REF != undefined) {
                    const reskegiatan = await sequelize.query("SELECT TOP 1 * FROM SXT01A WHERE ID1='" + req.body.ID1_REF + "'");
                    if (reskegiatan != null) {
                        ID1_REF = req.body.ID1_REF;
                    }
            }
            // GET COY_ID from current login user
            let COY_ID = 0;

            const [results, metadata] = await sequelize.query("SELECT TOP 1 * FROM ABF02A WHERE AKTIF = 1 AND IDK='" + req.user.IDK + "'");
            if (results != null) {
                COY_ID = results[0]['COY_ID'];
            }

            // save table header transaksi kegiatan
            const sql = "INSERT INTO SXT01A(IDK,LAT_,LONG_,COURSE,SPEED,TGL,TGL_INPUT,SIGNAL,BATTERY,KET,COY_ID,VISIT_ID,TYPE,ALTITUDE"
                + ",ACCURATE,CUST,LOKASI,ID1_REF) values('"
                + req.user.IDK + "','" + req.body.LAT_ + "','" + req.body.LONG_ + "','" + req.body.COURSE + "','" + req.body.SPEED
                + "','" + req.body.TGL + "','" + req.body.TGL_INPUT + "','" + req.body.SIGNAL + "','" + req.body.BATTERY + "','"
                + req.body.KET + "','" + COY_ID + "',NULL,0,'" + req.body.ALTITUDE + "','" + req.body.ACCURATE + "','"
                + req.body.CUST + "','" + req.body.LOKASI + "'," + (ID1_REF == null ? "NULL" : ID1_REF) + ")";
            let header = await sequelize.query(sql, {
                type: sequelize.QueryTypes.INSERT,
            }).then(function () {
                const results2 = sequelize.query("SELECT TOP 1 * FROM SXT01A ORDER BY ID1 DESC");
                if (results2 != null) {
                    return results2;
                    // console.log(results2);
                }
            });
            let headerid = header[0][0]['ID1'];
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
                const sqlprod = "INSERT INTO SXT01B(ID1,BRG,QTY,STN,TGL_INPUT) VALUES('"
                    + headerid + "','" + product[i]["BRG"] + "','" + product[i]["QTY"] + "','"
                    + product[i]["STN"] + "','" + req.body.TGL_INPUT + "')";
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
                const sqlmedia = "INSERT INTO SXT01C(ID1,MEDIA,QTY,TGL_INPUT) VALUES('"
                    + headerid + "','" + media[i]["MEDIA"] + "','" + media[i]["QTY"] + "','" + req.body.TGL_INPUT + "')";
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
                const sqlcrops = "INSERT INTO SXT01D(ID1,CROPS,TGL_INPUT) VALUES('"
                    + headerid + "','" + crops[i]["CROPS"] + "','" + req.body.TGL_INPUT + "')";
                sequelize.query(sqlcrops, {
                    type: sequelize.QueryTypes.INSERT
                });
            }
            // end of save crops

            // save image
            let image = req.body.image;
            for (let i = 0; i < image.length; i++) {
                let imagefilename = global.uploadBase64Image(image[i]);
            }
            // end of image

            await t.commit();
            res.json(global.getStandardResponse(0, "success : kegiatan saved", null));

        }
        catch (err) {
            await t.rollback();
            res.status(500).json(global.getStandardResponse(500, "API error : " + err.message, null));
        }
    },

    ViewDetailtKegiatan: async (req, res) => {
        try {
            let json = [];
            const [results, metadata] = await sequelize.query("SELECT * FROM SXT01A WHERE ID1 ='" + req.body.ID1 + "'");
            if (results != null) {
                json = results;
                const [results2, metadata2] = await sequelize.query("SELECT * FROM SXT01B WHERE ID1 ='" + req.body.ID1 + "'");
                if (results2 != null) {
                    json[0].PRODUCT = results2;
                }
                const [results3, metadata3] = await sequelize.query("SELECT * FROM SXT01C WHERE ID1 ='" + req.body.ID1 + "'");
                if (results3 != null) {
                    json[0].MEDIA = results3;
                }
                const [results4, metadata4] = await sequelize.query("SELECT * FROM SXT01C WHERE ID1 ='" + req.body.ID1 + "'");
                if (results4 != null) {
                    json[0].CROPS = results4;
                }
            }
            res.json(global.getStandardResponse(0, "success : get data kegiatan", json));
        }
        catch (err) {
            res.status(500).json(global.getStandardResponse(500, "API error : " + err.message, null));
        }
    },

    FinishKegiatan: async (req, res) => {
        try {
            const sql = "UPDATE SXT01A SET STATUS = 1 WHERE ID1 = '" + req.body.ID1 + "'";
            sequelize.query(sql, {
                type: sequelize.QueryTypes.UPDATE,
            }).then(function () {
                    res.json(global.getStandardResponse(0, "success : update status kegiatan", null));
            });
        }
        catch (err) {
            res.status(500).json(global.getStandardResponse(500, "API error : " + err.message, null));
        }
    }
}