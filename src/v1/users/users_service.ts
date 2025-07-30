import { Knex } from "knex";
import { knexClient } from "../../db";
import { ApplicationError, ErrorCode } from "../../utils/error_code";

export default class UserService {
	private client: Knex;

	constructor() {
		this.client = knexClient;
	}
	/**
	 * this gets the user by its id and throws NOT_FOUND_ERROR if none exist
	 * @param id: number, which is the id of the user you want to return its data
	 * @returns a user data
	 **/
	async getUser(id: number) {
		const user = await this.client
			.select(
				"users.id",
				"users.email",
				"users.first_name",
				"users.last_name",
				"wallet.wallet_number",
				"wallet.balance",
				"wallet.pending_balance",
				"wallet.id as walletId",
			)
			.from("users")
			.where({ "users.id": id })
			.join("wallet", function () {
				this.on("wallet.user_id", "=", "users.id");
			})
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
