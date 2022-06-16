const jwt = require("jsonwebtoken");
const { JWT_ACCESS_TOKEN_SECRET } = process.env;

module.exports = {
	createJWTToken: (payload, key, duration) => {
		return jwt.sign(payload, key, duration);
	},
	authJwt: async (req, res, next) => {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(" ")[1];
		jwt.verify(token, JWT_ACCESS_TOKEN_SECRET, async (err, decoded) => {
			if (err) {
				return res.status(403).send({ message: err.message });
			}
			req.user = decoded;
			return next();
		});
	},
};
