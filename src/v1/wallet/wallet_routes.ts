import { Hono } from "hono";
import { isAuthenticated } from "../../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { DepositSchema, TransferSchema } from "./wallet_schema";
import { ErrorCode } from "../../utils/error_code";
import WalletController from "./wallet_controller";

const walletRoutes = new Hono().basePath("/v1/wallet");
walletRoutes.use("*", isAuthenticated);

walletRoutes.post(
	"/deposit",
	zValidator("json", DepositSchema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					status_code: ErrorCode.VALIDATION_ERROR,
					message: "Validation Error",
					errors: result.error.issues,
				},
				400,
			);
		}
	}),
	WalletController.deposit,
);

walletRoutes.post(
	"/withdraw",
	zValidator("json", DepositSchema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					status_code: ErrorCode.VALIDATION_ERROR,
					message: "Validation Error",
					errors: result.error.issues,
				},
				400,
			);
		}
	}),
	WalletController.withdraw,
);

walletRoutes.post(
	"/transfer",
	zValidator("json", TransferSchema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					status_code: ErrorCode.VALIDATION_ERROR,
					message: "Validation Error",
					errors: result.error.issues,
				},
				400,
			);
		}
	}),
	WalletController.transfer,
);
export default walletRoutes;
