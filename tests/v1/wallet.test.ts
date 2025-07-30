import { describe, it, beforeAll, expect } from "vitest";
import app from "../../src/app";
import { User } from "../../src/v1/authentication/auth_schema";
import { ErrorCode } from "../../src/utils/error_code";
import { createMockUser, getMockUserWalletNumber } from "./utils/mock";

describe("testing that user wallet functions as expected", () => {
	let userData: User & { id: number; balance: number; pending_balance: number };
	let access_token: string;
	let receiversWalletNumber: number;

	beforeAll(async () => {
		const { user, token } = await createMockUser(app, {
			email: "tester3@gmail.com",
		});
		userData = user;
		access_token = token;
		receiversWalletNumber = await getMockUserWalletNumber(app, {
			email: "tester10@app.com",
		});
	});

	it("test that user wallet was incremented after the deposit occured", async () => {
		const deposit = {
			amount: 4000,
		};
		const res = await app.request("api/v1/wallet/deposit", {
			method: "POST",
			body: JSON.stringify(deposit),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});

		expect(res.status).toBe(200);
		const json = await res.json();

		expect(json).toMatchObject({
			status_code: ErrorCode.SUCCESS,
			message: "Deposit Successful",
		});

		expect(json.data).toMatchObject({
			balance: "4000.00",
			pending_balance: "4000.00",
		});
	});

	it("test that depositing fails when called without amount", async () => {
		const res = await app.request("api/v1/wallet/deposit", {
			method: "POST",
			body: JSON.stringify({}),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});

		expect(res.status).toBe(400);
		const json = await res.json();

		expect(json).toMatchObject({
			status_code: ErrorCode.VALIDATION_ERROR,
		});
	});

	it("test deposit fails for user who is not authenticated", async () => {
		const deposit = {
			amount: 4000,
		};
		const res = await app.request("api/v1/wallet/deposit", {
			method: "POST",
			body: JSON.stringify(deposit),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer token`,
			}),
		});

		expect(res.status).toBe(401);
	});

	it("test that user tranfer was successful and balance was decrimented ", async () => {
		const transferData = {
			amount: 2000,
			wallet_number: receiversWalletNumber,
			description: "this is testing transfer",
		};

		const res = await app.request("api/v1/wallet/transfer", {
			method: "POST",
			body: JSON.stringify(transferData),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});
		const json = await res.json();

		expect(res.status).toBe(200);

		expect(json).toMatchObject({
			status_code: ErrorCode.SUCCESS,
			message: "Transfer Successful",
		});

		expect(json.data).toMatchObject({
			balance: "2000.00",
			pending_balance: "2000.00",
		});
	});

	it("test that ther senders balance is less than the amount being transfered", async () => {
		const transferData = {
			amount: 6000,
			wallet_number: receiversWalletNumber,
			description: "this is testing transfer",
		};
		const res = await app.request("api/v1/wallet/transfer", {
			method: "POST",
			body: JSON.stringify(transferData),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});
		const json = await res.json();

		expect(res.status).toBe(400);

		expect(json).toMatchObject({
			status_code: ErrorCode.WALLET_ERROR,
			message: "Insufficient Balance",
		});
	});

	it("should throw an error if transfer does not receive a valid body", async () => {
		const transferData = {
			amount: 2000,
			wallet_number: receiversWalletNumber,
		};
		const res = await app.request("api/v1/wallet/transfer", {
			method: "POST",
			body: JSON.stringify(transferData),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});
		const json = await res.json();

		expect(res.status).toBe(400);

		expect(json).toMatchObject({
			status_code: ErrorCode.VALIDATION_ERROR,
			message: "Validation Error",
		});
	});

	it("test that receiver wallet number does not match any users wallet and error should return ", async () => {
		const transferData = {
			amount: 2000,
			wallet_number: 27387287282,
			description: "this is testing transfer",
		};
		const res = await app.request("api/v1/wallet/transfer", {
			method: "POST",
			body: JSON.stringify(transferData),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});
		const json = await res.json();

		expect(res.status).toBe(404);

		expect(json).toMatchObject({
			status_code: ErrorCode.NOT_FOUND_ERROR,
			message: "Receivers Wallet not found",
		});
	});
});

describe("testing withdrawl functions", () => {
	let userData: User & { id: number; balance: number; pending_balance: number };
	let access_token: string;
	let receiversWalletNumber: number;

	beforeAll(async () => {
		const { user, token } = await createMockUser(app, {
			email: "tester8@gmail.com",
		});
		userData = user;
		access_token = token;
		receiversWalletNumber = await getMockUserWalletNumber(app, {
			email: "tester10@app.com",
		});
	});

	it("test that user withdrawal is successful and there is deduction of the said amount from their balance", async () => {
		const deposit = {
			amount: 8000,
		};

		await app.request("api/v1/wallet/deposit", {
			method: "POST",
			body: JSON.stringify(deposit),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});

		const withdrawData = {
			amount: 4000,
		};
		const res = await app.request("api/v1/wallet/withdraw", {
			method: "POST",
			body: JSON.stringify(withdrawData),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});
		const json = await res.json();

		expect(res.status).toBe(200);

		expect(json).toMatchObject({
			status_code: ErrorCode.SUCCESS,
			message: "Withdrawal Successful",
		});

		expect(json.data).toMatchObject({
			balance: "4000.00",
		});
	});

	it("test that withdrawal fails if the amount to withdraw is greater than avaliable balance", async () => {
		const withdrawData = {
			amount: 10000,
		};
		const res = await app.request("api/v1/wallet/withdraw", {
			method: "POST",
			body: JSON.stringify(withdrawData),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});
		const json = await res.json();

		expect(res.status).toBe(400);

		expect(json).toMatchObject({
			status_code: ErrorCode.WALLET_ERROR,
			message: "Insufficient Balance",
		});
	});
	it("test that withdrawal fails if the data is not valid", async () => {
		const res = await app.request("api/v1/wallet/withdraw", {
			method: "POST",
			body: JSON.stringify({}),
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});
		const json = await res.json();
		expect(res.status).toBe(400);

		expect(json).toMatchObject({
			status_code: ErrorCode.VALIDATION_ERROR,
			message: "Validation Error",
		});
	});
});
