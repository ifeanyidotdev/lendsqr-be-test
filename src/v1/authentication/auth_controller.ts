import { Context } from "hono";
import AuthService from "./auth_service";
import { ApplicationError, ErrorCode } from "../../utils/error_code";
import { SigninSchemaType, SignupSchemaType } from "./auth_schema";

class AuthController {
	private authService: AuthService;
	constructor(service: AuthService) {
		this.authService = service;
		this.signup = this.signup.bind(this);
		this.signin = this.signin.bind(this);
	}

	async signup(c: Context) {
		try {
			const data: SignupSchemaType = await c.req.json();
			const res = await this.authService.signup(data);
			return c.json(
				{
					status_code: ErrorCode.SUCCESS,
					message: "Account Created Successful",
					data: res,
				},
				201,
			);
		} catch (err) {
			if (err instanceof ApplicationError) {
				return c.json(
					{
						status_code: err.code,
						message: err.message,
					},
					400,
				);
			}
			return c.json(
				{
					status_code: ErrorCode.SERVER_ERROR,
					message: "Internal Server Error",
				},
				500,
			);
		}
	}

	async signin(c: Context) {
		try {
			const data: SigninSchemaType = await c.req.json();

			const res = await this.authService.signin(data);
			return c.json({
				status_code: ErrorCode.SUCCESS,
				message: "Signin Successful",
				data: res,
			});
		} catch (err) {
			if (err instanceof ApplicationError) {
				return c.json(
					{
						status_code: err.code,
						message: err.message,
					},
					400,
				);
			}
			return c.json(
				{
					status_code: ErrorCode.SERVER_ERROR,
					message: "Internal Server Error",
				},
				500,
			);
		}
	}
}

const authService = new AuthService();
export default new AuthController(authService);
