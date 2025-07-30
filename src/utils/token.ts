import { sign, verify } from "hono/jwt";
import { User } from "../v1/authentication/auth_schema";
import { ErrorCode, TokenError } from "./error_code";

const SECRET_KEY = process.env.SECRET_KEY || "token";
const TOKEN_EXPIRATION_SECONDS = (process.env.TOKEN_EXPIRATION_SECONDS ||
	25200) as number;

export async function generateToken(
	user: User & { id: number },
): Promise<string> {
	const access_token = await sign(
		{
			userId: user.id,
			email: user.email,
			exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_SECONDS,
		},
		SECRET_KEY,
	);
	return access_token;
}

export async function verifyToken(token: string) {
	try {
		const data = await verify(token, SECRET_KEY);
		return data;
	} catch (_) {
		throw new TokenError("Invalid or Expired Token", ErrorCode.TOKEN_ERROR);
	}
}
