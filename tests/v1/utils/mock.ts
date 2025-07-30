import { Hono } from "hono";

export async function createMockUser<T extends { email: string }>(
	app: Hono,
	mockData: T,
) {
	const data = {
		email: mockData.email,
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
		email: mockData.email,
		password: "Password11@",
	};
	const res = await app.request("api/v1/auth/signin", {
		method: "POST",
		body: JSON.stringify(signinData),
		headers: new Headers({ "Content-Type": "application/json" }),
	});

	const json = await res.json();

	const user = json.data.user;
	const token = json.data.token;
	return { user, token };
}
