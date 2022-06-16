const apiAdapter = require("../routes/apiAdapter");
const { URL_SERVICE_CRM } = process.env;

const api = apiAdapter(URL_SERVICE_CRM);

module.exports = (...permission) => {
	return async (req, res, next) => {
		try {
			const id = req.user.id;
			const access = await api.get(`/user/${id}/access`);
			const data = access.data.data.access;
			if (data.some((e) => permission.includes(e.access_code))) {
				return next();
			}
			return res.status(401).send({
				code: 401,
				message: "invalid permission",
			});
		} catch (err) {
			if (err.code === "ECONNREFUSED") {
				return res
					.status(500)
					.send({ code: 500, message: "service unavailable" });
			} else if (err.code === "ECONNABORTED") {
				return res.status(500).send({ code: 500, message: "Request Timeout" });
			}

			const { status, data } = err.response;
			return res.status(status).send(data);
		}
	};
};
