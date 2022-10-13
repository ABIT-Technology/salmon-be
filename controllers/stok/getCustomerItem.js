const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = {
    getItembyCustomerId: async (req, res) => {
        try {
            // const [results1, metadata1] = await sequelizeSBOX.query(
			// 	`SELECT * FROM SBF01A WHERE IDK = ${req.user.IDK};`,
			// );

			// if (results1.length <= 0) {
			// 	return res.status(404).send({
			// 		code: 404,
			// 		message: "User not found",
			// 	});
			// }

            const [results, metadata] = await sequelize.query(
				"select B.* from vwBRG_CUST A LEFT JOIN vwSTF02 B ON A.BRG = B.BRG WHERE A.CUST ='" + req.CUST + "'",
			);
			res.json(global.getStandardResponse(0, "success", results));
        }
        catch (err) {
			res.status(500).json(global.getStandardResponse(500, "API error", null));
		}
    }
};