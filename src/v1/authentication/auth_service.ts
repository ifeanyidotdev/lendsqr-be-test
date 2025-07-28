import { Knex } from "knex";
import { knexClient } from "../../db/index";
import { SignupSchemaType, User } from "./auth_schema";

export default class AuthService {
	private client: Knex;
	constructor() {
		this.client = knexClient;
	}

	async checkCrediblity(email: string): Promise<boolean> {
		const reponse = await fetch(
			`https://adjutor.lendsqr.com/v2/verification/karma/${email}`,
		);
		if (reponse.status != 200)
			throw new Error("Could not validate your creditblity");

		const responseBody = await reponse.json();

		if (responseBody.status == "success") {
			return true;
		}
		return false;
	}

	async signup(data: SignupSchemaType) {
		try {
			const user = await this.client
				.select("*")
				.from<User>("users")
				.where({ email: data.email });

			if (user) {
				throw new Error("Account is taken");
			}
		} catch (error) {
			throw error;
		}
	}
}
