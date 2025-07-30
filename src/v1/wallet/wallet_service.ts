import { Knex } from "knex";
import { knexClient } from "../../db";
import { DepositSchemaType, Wallet } from "./wallet_schema";
import { ApplicationError, ErrorCode } from "../../utils/error_code";
import de from "zod/v4/locales/de.cjs";
import { TransactionStatus, TransactionType } from "../../types/trx";

export default class WalletService {
	private client: Knex;

	constructor() {
		this.client = knexClient;
	}

	async deposit(depositData: DepositSchemaType) {
		try {
			const wallet = await this.client
				.select("*")
				.from<Wallet>("wallet")
				.where({ user_id: depositData.userId })
				.first();

			if (wallet == undefined) {
				throw new ApplicationError(
					"Deposit Error",
					ErrorCode.CREDENTIAL_ERROR,
					400,
				);
			}
			const result = await this.client.transaction(async (trx) => {
				const balance_after = wallet.balance + depositData.amount;
				await trx("wallet")
					.where("id", "=", wallet.id)
					.increment("balance", depositData.amount)
					.increment("pending_balance", depositData.amount);

				await trx("transaction").insert({
					user_id: depositData.userId,
					wallet_id: wallet.id,
					transaction_type: TransactionType.DEPOSIT,
					transaction_status: TransactionStatus.SUCCESS,
					amount: depositData.amount,
					balance_after,
					currency: "NGN",
				});
				const updatedWallet = await trx
					.select("*")
					.from<Wallet>("wallet")
					.where({ user_id: depositData.userId })
					.first();

				return updatedWallet;
			});
			return result;
		} catch (error) {
			throw error;
		}
	}
}
