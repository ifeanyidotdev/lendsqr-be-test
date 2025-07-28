import { describe, expect, it } from "vitest";

import app from "../../src/app";
import { ErrorCode } from "../../src/utils/error_code";

describe("Testing signing up flow", () => {
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
		});

		expect(res.status).toBe(201);
		expect(await res.json()).toContain({
			status_code: ErrorCode.SUCCESS,
		});
	});
});
