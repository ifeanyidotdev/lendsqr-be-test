import z from "zod";

export const TransferSchema = z.object({
	wallet_number: z.number({ error: "Wallet Number is required" }),
	amount: z.number({ error: "Amount is required" }),
	description: z.string({ error: "description is required" }),
});

export type TransferSchemaType = z.infer<typeof TransferSchema> & {
	senderId: number;
};

export const DepositSchema = z.object({
	amount: z.number({ error: "Amount is required" }),
});

export type DepositSchemaType = z.infer<typeof DepositSchema> & {
	userId: number;
};

export interface Wallet {
	id: number;
	wallet_number: number;
	balance: number;
	pending_balance: number;
	user_id: number;
	createdAt: string;
	updatedAt: string;
}
