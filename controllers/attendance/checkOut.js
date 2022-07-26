const Joi = require("joi");
const { SBF01A, ABF27B, ABF27C, sequelize } = require("../../models");

module.exports = async (req, res) => {
	const schema = Joi.object({
		CIN_REF: Joi.number().required(),
		TGL: Joi.string().optional().allow(null),
		WKT: Joi.string().optional().allow("", null),
		KET: Joi.string().optional().allow(null),
		USER_INPUT: Joi.string().optional().allow("", null),
		PROSES: Joi.boolean().optional().allow(null),
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

	const t = await sequelize.transaction();
	try {
		const user = await SBF01A.findOne({
			where: { IDK: req.user.IDK },
			raw: true,
		});

		if (!user) {
			return res.status(409).send({
				code: 409,
				message: "User not found",
			});
		}

		const { KET, USER_INPUT, PROSES } = req.body;

		req.body.TGL = new Date(req.body.TGL);
		const TGL = req.body.TGL instanceof Date && !isNaN(req.body.TGL);
		if (!TGL) {
			req.body.TGL = new Date();
		}

		req.body.WKT = new Date(req.body.WKT);
		const WKT = req.body.WKT instanceof Date && !isNaN(req.body.WKT);
		if (!WKT) {
			req.body.WKT = new Date();
		}

		const ABF27B_data = {
			KET,
			USER_INPUT,
			PROSES,
			TGL: req.body.TGL,
			WKT: req.body.WKT,
			IDK: user.IDK,
			JABSEN: "Out",
			USERID: user.ID1,
			TGL_INPUT: new Date(),
		};
		await ABF27B.create(ABF27B_data, { transaction: t });

		const ABF27C_data = {
			COUT: req.body.TGL,
			TGL_UPDATE: new Date(),
		};
		await ABF27C.update(
			ABF27C_data,
			{
				where: { ID_REF: req.body.CIN_REF },
			},
			{ transaction: t },
		);
		await t.commit();
		res.send({
			code: 0,
			message: "Success",
		});
	} catch (err) {
		await t.rollback();
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
