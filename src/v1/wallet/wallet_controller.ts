import { Context } from "hono";
import WalletService from "./wallet_service";
import { ApplicationError, ErrorCode } from "../../utils/error_code";
import { DepositSchemaType } from "./wallet_schema";

class WalletController {
	private service: WalletService;

	constructor(service: WalletService) {
		this.service = service;
		this.deposit = this.deposit.bind(this);
	}

	async deposit(c: Context) {
		try {
			const data: DepositSchemaType = c.req.valid("json");
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
}

const walletService = new WalletService();
export default new WalletController(walletService);
