const apiAdapter = require("../routes/apiAdapter");
const { URL_SERVICE_APPLICANT } = process.env;

const api = apiAdapter(URL_SERVICE_APPLICANT);

module.exports = async (req, res, next) => {
	try {
		await api.post(`/maintenance-setting/check-maintenance`, {
			original_url: req.originalUrl,
		});
		return next();
	} catch (err) {
		if (err.code === "ECONNREFUSED") {
			return res
				.status(500)
				.send({ code: 500, message: "service unavailable" });
		}

		const { status, data } = err.response;
		return res.status(status).send(data);
	}
};
