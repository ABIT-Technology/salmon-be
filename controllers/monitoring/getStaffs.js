const Joi = require("joi");
const sequelize = require("../../config/configdb");
const global = require("../../config/global");
const { SBF01A } = require("../../models");

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

		const WIL = `AND a.WIL = ${req.query.WIL};`;

		const [results, metadata] = await sequelize.query(
			`SELECT b.ID1, b.IDK, d.NAWIL, c.NIK FROM SBF01D a
            JOIN ABF02A b
            ON a.IDK = b.IDK
            JOIN ABF02A c
            ON b.IDK = c.IDK
			JOIN VWABF10B d
			ON a.WIL = d.WIL
            WHERE a.ID1 = ${user.ID1} ${req.query.WIL === "" ? ";" : WIL}`,
		);
		res.json(global.getStandardResponse(0, "success", results));
	} catch (err) {
		res.status(500).json(global.getStandardResponse(500, "API error", null));
	}
};
