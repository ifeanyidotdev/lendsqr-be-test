import { describe, it, beforeAll, expect } from "vitest";
import app from "../../src/app";
import { User } from "../../src/v1/authentication/auth_schema";
import { ErrorCode } from "../../src/utils/error_code";
import { createMockUser } from "./utils/mock";

describe("testing that user wallet functions as expected", () => {
	let userData: User & { id: number; balance: number; pending_balance: number };
	let access_token: string;

	beforeAll(async () => {
		const { user, token } = await createMockUser(app, {
			email: "tester3@gmail.com",
		});
		userData = user;
		access_token = token;
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
		const deposit = {
			amount: 2000,
			wallet_number: 93893893893,
			description: "this is testing transfer",
		};
		const res = await app.request("api/v1/wallet/transfer", {
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
			message: "Transfer Successful",
		});

		expect(json.data).toMatchObject({
			balance: "2000.00",
			pending_balance: "2000.00",
		});
	});
});
