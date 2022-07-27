
const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const { SBF01A } = require("../../models");


module.exports = async (req, res) => {
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
         // GET COY_ID from current login user
         let COY_ID = '0';

         const results2= await sequelize.query("SELECT TOP 1 * FROM ABF02A WHERE AKTIF = 1 AND IDK='" + req.user.IDK + "'");
         if (results2 != null) {
             COY_ID = results2[0][0]['COY_ID'];
         }
        const [results, metadata] = await sequelize.query("SELECT * FROM SXF03 WHERE AKTIF = 1 AND KEGIATAN = 1 AND COY_ID = '" + COY_ID + "'");
        res.json(global.getStandardResponse(0, "success", results));
    }
    catch (err) {
        res.status(500).json(global.getStandardResponse(500, "API error", null));
    }
}