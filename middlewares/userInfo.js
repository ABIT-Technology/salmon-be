const apiAdapter = require("../routes/apiAdapter");
const { URL_SERVICE_CRM } = process.env;

const api = apiAdapter(URL_SERVICE_CRM);

module.exports = async (req, res, next) => {
	try {
		const id = req.user.id;
		const user = await api.get(`/user/${id}`);
		req.user = { ...req.user, ...user.data.data };
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
