import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import AuthController from "./auth_controller";
import { signinSchema, signupSchema } from "./auth_schema";
import { ErrorCode } from "../../utils/error_code";

const authRoutes = new Hono().basePath("/v1/auth");
authRoutes.post(
	"/signup",
	zValidator("json", signupSchema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					status_code: ErrorCode.VALIDATION_ERROR,
					message: "Validation Error",
					errors: result.error.issues,
				},
				400,
			);
		}
	}),
	AuthController.signup,
);
authRoutes.post(
	"/signin",
	zValidator("json", signinSchema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					status_code: ErrorCode.VALIDATION_ERROR,
					message: "Validation Error",
					errors: result.error.issues,
				},
				400,
			);
		}
	}),
	AuthController.signin,
);

export default authRoutes;
