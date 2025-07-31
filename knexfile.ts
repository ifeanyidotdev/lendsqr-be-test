import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
	development: {
		client: "mysql2",
		connection: {
			host: process.env.DB_HOST || "localhost",
			user: process.env.DB_USER || "root",
			password: process.env.DB_PASSWORD || "rootpassword",
			database: process.env.DB_NAME || "mydb",
			port: (process.env.DB_PORT || 3306) as number,
		},
		migrations: {
			directory: "./src/db/migrations",
			tableName: "knex_migrations",
		},
		seeds: {
			directory: "./src/db/seeds",
		},
	},
	production: {
		client: "mysql2",
		connection: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			port: (process.env.DB_PORT || 3306) as number,
		},
		migrations: {
			directory: "./src/db/migrations",
			tableName: "knex_migrations",
			loadExtensions: [".js"],
		},
		seeds: {
			directory: "./src/db/seeds",
		},
	},
	testing: {
		client: "mysql2",
		connection: {
			host: process.env.TEST_DB_HOST || "localhost",
			user: process.env.TEST_DB_USER || "root",
			password: process.env.TEST_DB_PASSWORD || "rootpassword",
			database: process.env.TEST_DB_NAME || "lendsqr_be_test_testing",
		},
		migrations: {
			directory: "./src/db/migrations",
			tableName: "knex_migrations",
			loadExtensions: [".ts"],
		},
	},
};

export default config;
