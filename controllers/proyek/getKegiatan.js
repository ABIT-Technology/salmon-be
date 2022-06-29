
const sequelize = require("../../config/configdb");
const global = require("../../config/global");



module.exports = async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query("SELECT * FROM SXF03 WHERE AKTIF = 1 AND PROYEK = 1");
        res.json(global.getStandardResponse(0, "success", results));
    }
    catch (err) {
        res.status(500).json(global.getStandardResponse(500, "API error", null));
    }
}