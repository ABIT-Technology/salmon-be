const crypto = require("crypto");
const apiAdapter = require("../routes/apiAdapter");
const { URL_SERVICE_APPLICANT, SECRET_API_CODE } = process.env;

const api = apiAdapter(URL_SERVICE_APPLICANT);

module.exports = {
	basic: async (req, res, next) => {
		try {
			// check for basic auth header
			if (
				!req.headers.authorization ||
				req.headers.authorization.indexOf("Basic ") === -1
			) {
				return res.status(401).send({
					code: 401,
					message: "Missing Authorization Header",
				});
			}

			// verify auth credentials
			const myApiKey = req.headers["authorization"].split(" ")[1];
			const credentials = Buffer.from(myApiKey, "base64").toString("ascii");
			const [username, password] = credentials.split(":");

			if (!username || !password) {
				return res.status(401).send({
					code: 401,
					message: "invalid authorization",
				});
			}

			const hashedPassword = crypto
				.createHmac("sha256", SECRET_API_CODE)
				.update(password)
				.digest("hex");

			await api.get("/partner-api-key/validate/key", {
				params: { username, password: hashedPassword },
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
	},
};
