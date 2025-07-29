import { Context } from "hono";
import UserService from "./users_service";
import { ApplicationError, ErrorCode } from "../../utils/error_code";

class UserController {
	private service: UserService;

	constructor(service: UserService) {
		this.service = service;
		this.getUser = this.getUser.bind(this);
	}

	async getUser(c: Context) {
		try {
			const id = parseInt(c.req.param("id"));
			const res = await this.service.getUser(id);
			return c.json(
				{
					status_code: ErrorCode.SUCCESS,
					message: "User Information",
					data: res,
				},
				200,
			);
		} catch (error) {
			console.log(error);

			if (error instanceof ApplicationError) {
				return c.json(
					{
						status_code: error.code,
						message: error.message,
					},
					error.status ?? 400,
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

const userService = new UserService();
export default new UserController(userService);
