require("dotenv").config();

const { DB_NAME2, DB_PASSWORD2, DB_USERNAME2, DB_HOSTNAME2, DB_PORT2 } =
	process.env;

module.exports = {
	development: {
		username: DB_USERNAME2,
		password: DB_PASSWORD2,
		database: DB_NAME2,
		host: DB_HOSTNAME2,
		port: parseInt(DB_PORT2),
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
		username: DB_USERNAME2,
		password: DB_PASSWORD2,
		database: DB_NAME2,
		host: DB_HOSTNAME2,
		port: parseInt(DB_PORT2),
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
		username: DB_USERNAME2,
		password: DB_PASSWORD2,
		database: DB_NAME2,
		host: DB_HOSTNAME2,
		port: parseInt(DB_PORT2),
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
