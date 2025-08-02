import { Knex } from "knex";
import * as argon from "argon2";
import { knexClient } from "../../db/index";
import { SigninSchemaType, SignupSchemaType, User } from "./auth_schema";
import { ApplicationError, ErrorCode } from "../../utils/error_code";
import { generateToken } from "../../utils/token";
import { AJUTOR_API_KEY } from "../../utils/config";

export default class AuthService {
	private client: Knex;
	constructor() {
		this.client = knexClient;
	}

	private genereateWalletNumber(): number {
		return parseInt(
			Math.floor(1000000000 + Math.random() * 9000000000)
				.toString()
				.padStart(10, "0"),
		);
	}

	private async checkCrediblity(email: string): Promise<boolean> {
		const response = await fetch(
			`https://adjutor.lendsqr.com/v2/verification/karma/${email}`,
			{
				headers: {
					Authorization: `Bearer ${AJUTOR_API_KEY}`,
				},
			},
		);

		const responseBody = await response.json();

		if (response.status != 200) {
			throw new ApplicationError(
				"Could not validate your creditblity",
				ErrorCode.CREDENTIAL_ERROR,
				400,
			);
		}

		if (responseBody.data && responseBody.data.karma_identity) {
			return responseBody.data.karma_identity === email;
		}

		return true;
	}

	/**
	 * hanldes the signup of user account by users providing their basic info
	 * takes a @type SignupSchemaType which is a definition of the params
	 * @param email string
	 * @param first_name string
	 * @param last_name string
	 * @param password  string
	 * @returns a user data is returned
	 **/
	async signup(data: SignupSchemaType) {
		try {
			const userExist = await this.client
				.select("id", "email")
				.from<User>("users")
				.where({ email: data.email })
				.first();

			const crediblity = await this.checkCrediblity(data.email);
			if (userExist || crediblity) {
				throw new ApplicationError(
					"Account is taken or email is not credible",
					ErrorCode.ACCOUNT_CREATION,
				);
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

	/**
	 * hanldes the signin of user account by user providing their credentials
	 * takes a @type SigninSchemaType which is a definition of the params
	 * @param email string
	 * @param password  string
	 * @returns a data {user, token} where token is the access token
	 **/
	async signin(data: SigninSchemaType) {
		try {
			const user = await this.client
				.select("id", "email", "password")
				.from<User>("users")
				.where({ email: data.email })
				.first();

			if (!user) {
				throw new ApplicationError(
					"Incorrect Credential",
					ErrorCode.CREDENTIAL_ERROR,
				);
			}
			const isCorrectPwd: boolean = await argon.verify(
				user.password,
				data.password,
			);
			if (!isCorrectPwd) {
				throw new ApplicationError(
					"Incorrect Credential",
					ErrorCode.CREDENTIAL_ERROR,
				);
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

