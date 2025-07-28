import { Knex } from "knex";
import * as argon from "argon2";
import { knexClient } from "../../db/index";
import { SigninSchemaType, SignupSchemaType, User } from "./auth_schema";
import { ApplicationError } from "../../utils/error_code";
import { generateToken } from "../../utils/token";

export default class AuthService {
	private client: Knex;
	constructor() {
		this.client = knexClient;
	}

	genereateWalletNumber(): number {
		return parseInt(
			Math.floor(1000000000 + Math.random() * 9000000000)
				.toString()
				.padStart(10, "0"),
		);
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
			const userExist = await this.client
				.select("id", "email")
				.from<User>("users")
				.where({ email: data.email })
				.first();

			if (userExist) {
				throw new ApplicationError("Account is taken");
			}
			const hashPw = await argon.hash(data.password);

			const result = await this.client.transaction(async (trx) => {
				const [id] = await trx
					.insert({
						password: hashPw,
						email: data.email,
						first_name: data.first_name,
						last_name: data.last_name,
					})
					.into("users");
				await trx
					.insert({
						user_id: id,
						currency: "NGN",
						wallet_number: this.genereateWalletNumber(),
					})
					.into("wallet");

				const user = await trx
					.select("email", "first_name", "last_name")
					.from("users")
					.where({ id })
					.first();

				return user;
			});
			return result;
		} catch (error) {
			throw error;
		}
	}

	async signin(data: SigninSchemaType) {
		try {
			const user = await this.client
				.select("id", "email", "password")
				.from<User>("users")
				.where({ email: data.email })
				.first();

			if (!user) {
				throw new ApplicationError("Incorrect Credential");
			}
			const isCorrectPwd: boolean = await argon.verify(
				user.password,
				data.password,
			);
			if (!isCorrectPwd) {
				throw new ApplicationError("Incorrect Credential");
			}
			const accessToken: string = await generateToken(user);
			const res = {
				user: {
					id: user.id,
					email: user.email,
				},
				token: accessToken,
			};
			return res;
		} catch (error) {
			throw error;
		}
	}
}
