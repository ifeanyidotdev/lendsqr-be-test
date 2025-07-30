import { Context, Next } from "hono";
import { jwt } from "hono/jwt";
import { ErrorCode } from "../utils/error_code";

export type AuthVariables = {
	userId: string;
	email: string;
	iat?: number;
	exp?: number;
};

const SECRET_KEY = process.env.SECRET_KEY || "token";

// This middleware will verify the JWT and set the payload on the context.
export const isAuthenticated = async (c: Context, next: Next) => {
	const jwtMiddleware = jwt({
		secret: SECRET_KEY,
	});

	try {
		return await jwtMiddleware(c, next);
	} catch (error: any) {
		if (error.name === "TokenExpiredError") {
			return c.json(
				{ message: "Token expired", status_code: ErrorCode.TOKEN_ERROR },
				401,
			);
		}
		if (error.name === "JsonWebTokenError") {
			return c.json(
				{ message: "Invalid token", status_code: ErrorCode.TOKEN_ERROR },
				401,
			);
		}
		return c.json(
			{
				message: "Authentication failed",
				status_code: ErrorCode.AUTHORIZATION_ERROR,
			},
			401,
		);
	}
};
