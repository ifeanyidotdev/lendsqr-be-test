import { Context } from "hono";
import AuthService from "./auth_service";

class AuthController {
	authService: AuthService;
	constructor(private service: AuthService) {
		this.authService = service;
	}

	async signup(c: Context) {
		const data = c.req.valid("json");
		return c.json({ message: "signup", data }, 200);
	}
}

const authService = new AuthService();
export default new AuthController(authService);
