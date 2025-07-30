import { beforeAll, describe, expect, it } from "vitest";
import app from "../../src/app";
import { ErrorCode } from "../../src/utils/error_code";
import { User } from "../../src/v1/authentication/auth_schema";
import { createMockUser } from "./utils/mock";

describe("testing that user information is correct", () => {
	let userData: User & { id: number; balance: number; pending_balance: number };
	let access_token: string;

	beforeAll(async () => {
		const { user, token } = await createMockUser(app, {
			email: "tester3@gmail.com",
		});
		userData = user;
		access_token = token;
	});

	it("test that a user profile was created after signup", async () => {
		const res = await app.request(`api/v1/users/${userData.id}`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});

		expect(res.status).toBe(200);
		const json = await res.json();

		expect(json).toMatchObject({
			status_code: ErrorCode.SUCCESS,
		});
		expect(json.data).toMatchObject({
			email: userData.email,
			id: userData.id,
		});
	});

	it("test that a user profile was created after signup while not authenticated", async () => {
		const res = await app.request(`api/v1/users/${userData.id}`, {
			method: "GET",
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		expect(res.status).toBe(401);
		const json = await res.json();

		expect(json).toMatchObject({
			status_code: ErrorCode.AUTHORIZATION_ERROR,
		});
	});

	it("test that a user profile was not found on the database", async () => {
		const res = await app.request(`api/v1/users/34`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}),
		});

		expect(res.status).toBe(404);

		const json = await res.json();

		expect(json).toMatchObject({
			status_code: ErrorCode.NOT_FOUND_ERROR,
		});
	});
});
