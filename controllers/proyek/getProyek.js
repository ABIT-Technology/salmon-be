const sequelize = require("../../config/configdb");
const global = require("../../config/global");

module.exports = async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query("select * from SXT02A a left join SXT02B b on a.ID1 = b.ID1"
        + " where b.IDK = " + req.user.IDK);
        res.json(global.getStandardResponse(0, "success", results));
    }
    catch (err) {
        res.status(500).json(global.getStandardResponse(500, "API error", null));
    }
}