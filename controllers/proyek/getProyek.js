const sequelize = require("../../config/configdb");
const global = require("../../config/global");

module.exports = {
    getMasterProyek: async (req, res) => {
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

            const [results, metadata] = await sequelize.query("select * from SXT02A a left join SXT02B b on a.ID1 = b.ID1"
                + " where b.IDK = " + req.user.IDK);
            res.json(global.getStandardResponse(0, "success", results));
        }
        catch (err) {
            res.status(500).json(global.getStandardResponse(500, "API error", null));
        }
    },
    getProyek: async (req, res) => {
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

            const [results, metadata] = await sequelize.query("SELECT * FROM SXT02C where MONTH(TGL) = " + req.body.BLN + " AND YEAR(TGL) = " + req.body.THN);
            res.json(global.getStandardResponse(0, "success", results));
        }
        catch (err) {
            res.status(500).json(global.getStandardResponse(500, "API error", null));
        }
    }
}