import { Context } from "hono";
import WalletService from "./wallet_service";
import { ApplicationError, ErrorCode } from "../../utils/error_code";
import { DepositSchemaType, TransferSchemaType } from "./wallet_schema";

class WalletController {
	private service: WalletService;

	constructor(service: WalletService) {
		this.service = service;
		this.deposit = this.deposit.bind(this);
		this.transfer = this.transfer.bind(this);
		this.withdraw = this.withdraw.bind(this);
	}

	async deposit(c: Context) {
		try {
			const data: DepositSchemaType = await c.req.json();

			const payload = c.get("jwtPayload");
			const res = await this.service.deposit({
				amount: data.amount,
				userId: payload.userId,
			});
			return c.json({
				status_code: ErrorCode.SUCCESS,
				message: "Deposit Successful",
				data: res,
			});
		} catch (error) {
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
					messagge: "Internal Server Error",
				},
				500,
			);
		}
	}

	async withdraw(c: Context) {
		try {
			const data: DepositSchemaType = await c.req.json();
			const payload = c.get("jwtPayload");
			const res = await this.service.withdraw({
				amount: data.amount,
				userId: payload.userId,
			});
			return c.json({
				status_code: ErrorCode.SUCCESS,
				message: "Withdrawal Successful",
				data: res,
			});
		} catch (error) {
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
					messagge: "Internal Server Error",
				},
				500,
			);
		}
	}
	async transfer(c: Context) {
		try {
			const data: TransferSchemaType = await c.req.json();
			const payload = c.get("jwtPayload");
			const res = await this.service.transfer({
				amount: data.amount,
				senderId: payload.userId,
				description: data.description,
				wallet_number: data.wallet_number,
			});
			return c.json({
				status_code: ErrorCode.SUCCESS,
				message: "Transfer Successful",
				data: res,
			});
		} catch (error) {
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
					messagge: "Internal Server Error",
				},
				500,
			);
		}
	}
}

const walletService = new WalletService();
export default new WalletController(walletService);
