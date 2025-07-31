import { serve } from "@hono/node-server";
import env from "dotenv";
env.config();
import app from "./app";

const PORT = process.env.PORT || 8000;

function startServer() {
	const server = serve({ fetch: app.fetch, port: PORT as number });
	console.log(`Server runing @ "http://localhost:${PORT}`);
	process.on("SIGINT", () => {
		server.close();
		process.exit(0);
	});
	process.on("SIGTERM", () => {
		server.close((err) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			process.exit(0);
		});
	});
}

startServer();
