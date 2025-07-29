import { beforeAll, describe, expect, it } from "vitest";
import app from "../../src/app";
import { ErrorCode } from "../../src/utils/error_code";
import { User } from "../../src/v1/authentication/auth_schema";

describe("testing that user information is correct", () => {
	let user: User & { id: number };
	let token: string;

	beforeAll(async () => {
		const data = {
			email: "tester1@gmail.com",
			first_name: "emma",
			last_name: "tester",
			password: "Password11@",
		};
		await app.request("api/v1/auth/signup", {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" }),
		});
		const signinData = {
			email: "tester1@gmail.com",
			password: "Password11@",
		};
		const res = await app.request("api/v1/auth/signin", {
			method: "POST",
			body: JSON.stringify(signinData),
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		const json = await res.json();

		user = json.data.user;
		token = json.data.token;
	});

	it("test that a user profile was created after signup", async () => {
		const res = await app.request(`api/v1/users/${user.id}`, {
			method: "GET",
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		expect(res.status).toBe(200);
		const json = await res.json();

		expect(json).toMatchObject({
			status_code: ErrorCode.SUCCESS,
		});
		expect(json.data).toMatchObject({
			email: user.email,
			id: user.id,
		});
	});

	it("test that a user profile was not found on the database", async () => {
		const res = await app.request(`api/v1/users/34`, {
			method: "GET",
			headers: new Headers({ "Content-Type": "application/json" }),
		});

		expect(res.status).toBe(404);

		const json = await res.json();

		expect(json).toMatchObject({
			status_code: ErrorCode.NOT_FOUND_ERROR,
		});
	});
});
