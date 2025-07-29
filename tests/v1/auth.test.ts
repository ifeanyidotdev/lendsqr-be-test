import { beforeAll, describe, expect, it } from "vitest";
import app from "../../src/app";
import { ErrorCode } from "../../src/utils/error_code";

describe("Testing authentication flow", () => {
	beforeAll(async () => {
		const data = {
			email: "tester@gmail.com",
			first_name: "emma",
			last_name: "tester",
			password: "Password11@",
		};
		await app.request("api/v1/auth/signup", {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" }),
		});
	});

	it("testing with correct data for success", async () => {
		const data = {
			email: "emma8@gmail.com",
			first_name: "emma",
			last_name: "tester",
			password: "Password11@",
		};
		const res = await app.request("api/v1/auth/signup", {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		const json = await res.json();
		expect(res.status).toBe(201);
		expect(json).toMatchObject({
			status_code: ErrorCode.SUCCESS,
		});
	});

	it("test account creating with wrong data", async () => {
		const data = {};
		const res = await app.request("api/v1/auth/signup", {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		const json = await res.json();
		expect(res.status).toBe(400);
		expect(json).toMatchObject({
			status_code: ErrorCode.VALIDATION_ERROR,
		});
	});
	it("test account creation if email is taken", async () => {
		const data = {
			email: "tester@gmail.com",
			first_name: "emma",
			last_name: "tester",
			password: "Password11@",
		};
		const res = await app.request("api/v1/auth/signup", {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		const json = await res.json();
		expect(res.status).toBe(400);
		expect(json).toMatchObject({
			status_code: ErrorCode.ACCOUNT_CREATION,
		});
	});
	it("test sigining in with wrong credentials ", async () => {
		const data = {
			email: "emma20@gmail.com",
			password: "Password11@",
		};
		const res = await app.request("api/v1/auth/signin", {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		const json = await res.json();
		expect(res.status).toBe(400);
		expect(json).toMatchObject({
			status_code: ErrorCode.CREDENTIAL_ERROR,
			message: "Incorrect Credential",
		});
	});
	it("test signining in with a correct credentials", async () => {
		const data = {
			email: "tester@gmail.com",
			password: "Password11@",
		};
		const res = await app.request("api/v1/auth/signin", {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		const json = await res.json();
		expect(res.status).toBe(200);
		expect(json).toMatchObject({
			status_code: ErrorCode.SUCCESS,
		});
	});
});
