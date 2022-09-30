const Joi = require("joi");
const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const sequelizeSBOX = require("../../config/configdb2");

module.exports = async (req, res) => {
	try {
		const schema = Joi.object({
			WIL: Joi.string().allow("", null).required(),
		}).options({
			allowUnknown: false,
		});

		const validate = schema.validate(req.query);

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
		const WIL2 = `AND a.WIL = ${req.query.WIL};`;

		const [results2, metadata2] = await sequelizeSBOX.query(
			`SELECT b.ID1, b.IDK, d.NAWIL, d.NAMA, d.NABAGIAN FROM	SBF01A a INNER JOIN	sbf01d b ON	a.ID1 = b.id1
			INNER JOIN	salmon2.dbo.vwabf02a c ON	a.IDK = c.idk
			INNER JOIN	salmon2.dbo.vwabf02a d ON	b.IDK = d.idk
			WHERE a.ID1 = '195' AND c.WIL2 = '${req.query.WIL}'`,
		);

		// const [results, metadata] = await sequelize.query(
		// 	`SELECT b.ID1, b.IDK, d.NAWIL, c.NIK FROM SBF01D a
		//     JOIN vwABF02A b
		//     ON a.IDK = b.IDK
		//     JOIN vwABF02A c
		//     ON b.IDK = c.IDK
		// 	JOIN VWABF10B d
		// 	ON a.WIL = d.WIL
		//     WHERE a.ID1 = ${results1[0].ID1} ${
		// 		req.query.WIL === "" ? ";" : WIL2
		// 	}`,
		// );
		res.json(global.getStandardResponse(0, "success", results2));
	} catch (err) {
		console.log(err);
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
