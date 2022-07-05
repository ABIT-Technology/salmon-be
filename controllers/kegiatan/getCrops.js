
const sequelize = require("../../config/configdb");
const global = require("../../config/global");



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

        const [results, metadata] = await sequelize.query("SELECT * FROM SXF02");
        res.json(global.getStandardResponse(0, "success", results));
    }
    catch (err) {
        res.status(500).json(global.getStandardResponse(500, "API error", null));
    }
}