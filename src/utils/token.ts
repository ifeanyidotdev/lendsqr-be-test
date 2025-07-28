import { sign, verify } from "hono/jwt";
import { User } from "../v1/authentication/auth_schema";

const SECRET_KEY = process.env.SECRET_KEY || "token";

export async function generateToken(
	user: User & { id: number },
): Promise<string> {
	const access_token = await sign(
		{ user_id: user.id, email: user.email },
		SECRET_KEY,
	);
	return access_token;
}

export async function verifyToken(token: string) {
	try {
		const data = await verify(token, SECRET_KEY);
		return data;
	} catch (_) {
		throw new Error("Invalid or Expired Token");
	}
}
