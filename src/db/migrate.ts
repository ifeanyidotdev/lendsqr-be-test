import { knexClient } from "../db/";

async function runMigrations() {
	try {
		await knexClient.migrate.latest();
		console.log("Migrations completed successfully");
	} catch (err: unknown) {
		console.error(`Error while runing migrations: ${err}`);
		process.exit(1);
	}
}

runMigrations();
