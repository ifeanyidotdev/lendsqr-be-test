import { Context, Hono } from "hono";

const app = new Hono();

app.get("/health", (c: Context) => {
	return c.json({ message: "success" }, 200);
});

export default app;
