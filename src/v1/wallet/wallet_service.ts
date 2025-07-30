import { Knex } from "knex";
import { knexClient } from "../../db";
import { DepositSchemaType, TransferSchemaType, Wallet } from "./wallet_schema";
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

	async withdraw(withdrawData: DepositSchemaType) {
		try {
			const wallet = await this.client
				.select("*")
				.from<Wallet>("wallet")
				.where({ user_id: withdrawData.userId })
				.first();

			if (wallet == undefined) {
				throw new ApplicationError(
					"Withdrawal Error",
					ErrorCode.CREDENTIAL_ERROR,
					400,
				);
			}
			if (wallet.balance < withdrawData.amount) {
				throw new ApplicationError(
					"Insufficient Balance",
					ErrorCode.WALLET_ERROR,
					400,
				);
			}
			const result = await this.client.transaction(async (trx) => {
				const balance_after = wallet.balance - withdrawData.amount;
				await trx("wallet")
					.where("id", "=", wallet.id)
					.decrement("balance", withdrawData.amount)
					.decrement("pending_balance", withdrawData.amount);

				await trx("transaction").insert({
					user_id: withdrawData.userId,
					wallet_id: wallet.id,
					transaction_type: TransactionType.WITHDRAWAL,
					transaction_status: TransactionStatus.SUCCESS,
					amount: withdrawData.amount,
					balance_after,
					currency: "NGN",
				});
				const updatedWallet = await trx
					.select("*")
					.from<Wallet>("wallet")
					.where({ user_id: withdrawData.userId })
					.first();

				return updatedWallet;
			});
			return result;
		} catch (error) {
			throw error;
		}
	}

	async transfer(transferData: TransferSchemaType) {
		try {
			const wallet = await this.client
				.select("*")
				.from<Wallet>("wallet")
				.where({ user_id: transferData.senderId })
				.first();

			if (wallet == undefined) {
				throw new ApplicationError(
					"Deposit Error",
					ErrorCode.CREDENTIAL_ERROR,
					400,
				);
			}

			if (wallet.balance < transferData.amount) {
				throw new ApplicationError(
					"Insufficient Balance",
					ErrorCode.WALLET_ERROR,
					400,
				);
			}
			const receiversWallet = await this.client
				.select(
					"users.id as user_id",
					"users.email",
					"users.first_name",
					"users.last_name",
					"wallet.wallet_number",
					"wallet.balance",
					"wallet.pending_balance",
					"wallet.id",
				)
				.from<Wallet>("wallet")
				.where({ wallet_number: transferData.wallet_number })
				.join("users", function () {
					this.on("users.id", "=", "wallet.user_id");
				})
				.first();

			if (receiversWallet == undefined)
				throw new ApplicationError(
					"Receivers Wallet not found",
					ErrorCode.NOT_FOUND_ERROR,
					404,
				);

			const result = await this.client.transaction(async (trx) => {
				const balance_after = wallet.balance - transferData.amount;
				await trx("wallet")
					.where("id", "=", wallet.id)
					.decrement("balance", transferData.amount)
					.decrement("pending_balance", transferData.amount);

				await trx("wallet")
					.where("id", "=", receiversWallet.id)
					.increment("balance", transferData.amount)
					.increment("pending_balance", transferData.amount);

				await trx("transaction").insert({
					user_id: transferData.senderId,
					wallet_id: wallet.id,
					transaction_type: TransactionType.TRANSFER,
					transaction_status: TransactionStatus.SUCCESS,
					amount: transferData.amount,
					balance_after,
					currency: "NGN",
					destination_wallet_id: receiversWallet.id,
					destination_user_id: receiversWallet.user_id,
					destination_user_name: `${receiversWallet.first_name} ${receiversWallet.last_name}`,
					description: transferData.description,
				});
				const updatedWallet = await trx
					.select("*")
					.from<Wallet>("wallet")
					.where({ user_id: transferData.senderId })
					.first();

				return updatedWallet;
			});
			return result;
		} catch (error) {
			throw error;
		}
	}
}
