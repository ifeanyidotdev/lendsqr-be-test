import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("users", (table) => {
		table.bigIncrements("id").primary();
		table.string("first_name", 255);
		table.string("last_name", 255);
		table.string("email", 255).unique();
		table.string("password", 255).notNullable();
		table.timestamps({
			useCamelCase: true,
			defaultToNow: true,
			useTimestamps: true,
		});
	});

	await knex.schema.createTable("wallet", (table) => {
		table.bigIncrements("id").primary();
		table.bigint("user_id").unsigned().notNullable().unique();
		table.foreign("user_id").references("users.id").onDelete("CASCADE");
		table.decimal("balance").notNullable().defaultTo("0.00");
		table.decimal("pending_balance").notNullable().defaultTo("0.00");
		table.string("wallet_number", 10).notNullable();
		table.string("currency", 10).notNullable();
		table.boolean("is_default").defaultTo("false").notNullable();
		table.timestamps({
			useCamelCase: true,
			defaultToNow: true,
			useTimestamps: true,
		});
	});

	await knex.schema.createTable("transaction", (table) => {
		table.bigIncrements("id").primary();
		table.bigint("wallet_id").unsigned().notNullable().unique();
		table.foreign("wallet_id").references("wallet.id").onDelete("CASCADE");
		table.bigint("user_id").unsigned().notNullable().unique();
		table.foreign("user_id").references("users.id").onDelete("CASCADE");
		table.string("transaction_type", 15).notNullable();
		table.string("transaction_status", 15).notNullable();
		table.decimal("balance_after").notNullable().defaultTo("0.00");
		table.decimal("amount").notNullable().defaultTo("0.00");
		table.string("currency", 10).notNullable();
		table.bigint("destination_user_id").unsigned().notNullable().unique();
		table
			.foreign("destination_user_id")
			.references("users.id")
			.onDelete("CASCADE");
		table.bigint("destination_wallet_id").unsigned().notNullable().unique();
		table
			.foreign("destination_wallet_id")
			.references("wallet.id")
			.onDelete("CASCADE");

		table.string("destination_user_name", 255).notNullable();
		table.text("description").notNullable();
		table.timestamps({
			useCamelCase: true,
			defaultToNow: true,
			useTimestamps: true,
		});
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("users");
	await knex.schema.dropTableIfExists("wallet");
	await knex.schema.dropTableIfExists("transaction");
}
