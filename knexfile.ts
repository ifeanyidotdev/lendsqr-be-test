import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
	development: {
		client: "mysql2",
		connection: {
			host: process.env.DB_HOST || "localhost",
			user: process.env.DB_USER || "root",
			password: process.env.DB_PASSWORD || "rootpassword",
			database: process.env.DB_NAME || "mydb",
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
		},
		migrations: {
			directory: "./src/db/migrations",
			tableName: "knex_migrations",
		},
		seeds: {
			directory: "./src/db/seeds",
		},
	},
	testing: {
		client: "better-sqlite3",
		connection: {
			filename: ":memory",
		},
		migrations: {
			directory: "./src/db/migrations",
			tableName: "knex_migrations",
		},
	},
};

export default config;
