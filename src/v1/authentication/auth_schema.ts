import { z } from "zod";

export const signupSchema = z.object({
	email: z.email(),
	firstName: z.string(),
	lastName: z.string(),
	password: z.string(),
});
export type SignupSchemaType = z.infer<typeof signupSchema>;

export type User = Omit<SignupSchemaType, "password">;
