const sequelizeSBOX = require("../../config/configdb2");

module.exports = async (req, res) => {
	try {
		const [results, metadata] = await sequelizeSBOX.query(
			`SELECT ID2,FORM_ID,IDK,READ_,UPDATE_,
			CANCEL_,PRINT_,APPROVE_ FROM SBF06B 
			WHERE AKTIF = ${1} AND IDK = '${req.user.IDK}';`,
		);

		res.send({
			code: 0,
			message: "Success",
			data: results,
		});
	} catch (err) {
		res.status(400).send({
			code: 400,
			message: err.message || "Server API Error",
		});
	}
};
