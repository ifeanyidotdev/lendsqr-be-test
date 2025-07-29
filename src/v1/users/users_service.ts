import { Knex } from "knex";
import { knexClient } from "../../db";
import { ApplicationError, ErrorCode } from "../../utils/error_code";

export default class UserService {
	private client: Knex;

	constructor() {
		this.client = knexClient;
	}

	async getUser(id: number) {
		const user = await this.client
			.select("id", "email", "first_name", "last_name")
			.from("users")
			.where({ id })
			.first();

		if (!user)
			throw new ApplicationError(
				"No user information found",
				ErrorCode.NOT_FOUND_ERROR,
				404,
			);

		return user;
	}
}
