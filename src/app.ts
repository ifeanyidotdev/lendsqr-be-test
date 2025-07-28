import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import v1Routes from "./v1";

const app = new Hono();
app.use(logger());
app.use(cors());

app.get("/health", (c: Context) => {
	return c.json({ message: "success" }, 200);
});

app.route("/", v1Routes);

export default app;
