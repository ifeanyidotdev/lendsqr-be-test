import { beforeAll, expect, describe, it } from "vitest";
import { generateToken, verifyToken } from "./token";

describe("test generating access token", () => {
	it("should return a string generated token", async () => {
		const user = {
			id: 2343093,
			email: "user@gmail.com",
			first_name: "user",
			last_name: "user",
		};
		const token = await generateToken(user);
		expect(token).toBeTypeOf("string");
		expect(token.length).toBeGreaterThan(10);
	});
});

describe("test validating token", () => {
	let token: string;
	beforeAll(async () => {
		token = await generateToken({
			id: 98983,
			email: "user@gmail.com",
			first_name: "user",
			last_name: "user",
		});
	});

	it("test verify token successeds", async () => {
		const payload = await verifyToken(token);
		expect(payload.userId).toBe(98983);
		expect(payload.email).toMatch("user@gmail.com");
	});

	it("test verify token successeds", async () => {
		await expect(() => verifyToken("sometoken")).rejects.toThrowError(
			"Invalid or Expired Token",
		);
	});
});
