import { z } from "zod";

export const signupSchema = z.object({
	email: z.email(),
	first_name: z.string(),
	last_name: z.string(),
	password: z.string(),
});

export const signinSchema = z.object({
	password: z.string(),
	email: z.email(),
});
export type SignupSchemaType = z.infer<typeof signupSchema>;
export type SigninSchemaType = z.infer<typeof signinSchema>;

export type User = Omit<SignupSchemaType, "password">;
