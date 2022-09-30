require("dotenv").config();

const { DB_NAME, DB_PASSWORD, DB_USERNAME, DB_HOSTNAME, DB_PORT } = process.env;

module.exports = {
	development: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME,
		host: DB_HOSTNAME,
		port: parseInt(DB_PORT),
		dialect: "mssql",
		dialectOptions: {
			// Observe the need for this nested `options` field for MSSQL
			options: {
				encrypt: false,
				enableArithAbort: false,
			},
		},
	},
	test: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME,
		host: DB_HOSTNAME,
		port: parseInt(DB_PORT),
		dialect: "mssql",
		dialectOptions: {
			// Observe the need for this nested `options` field for MSSQL
			options: {
				encrypt: false,
				enableArithAbort: false,
			},
		},
	},
	production: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME,
		host: DB_HOSTNAME,
		port: parseInt(DB_PORT),
		dialect: "mssql",
		dialectOptions: {
			// Observe the need for this nested `options` field for MSSQL
			options: {
				encrypt: false,
				enableArithAbort: false,
			},
		},
	},
};
