import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import AuthController from "./auth_controller";
import { signupSchema } from "./auth_schema";

const authRoutes = new Hono().basePath("/v1/auth");

authRoutes.post(
	"/signup",
	zValidator("json", signupSchema, (result, c) => {
		if (!result.success) {
			return c.json(
				{ message: "Validation Error", errors: result.error.issues },
				400,
			);
		}
	}),
	AuthController.signup,
);

export default authRoutes;
