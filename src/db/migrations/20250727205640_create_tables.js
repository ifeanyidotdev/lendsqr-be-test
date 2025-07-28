"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.createTable("users", (table) => {
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
        yield knex.schema.createTable("wallet", (table) => {
            table.bigIncrements("id").primary();
            table.bigint("user_id").unsigned().notNullable().unique();
            table.foreign("user_id").references("users.id").onDelete("CASCADE");
            table.decimal("balance").notNullable().defaultTo("0.00");
            table.decimal("pending_balance").notNullable().defaultTo("0.00");
            table.string("wallet_number", 10).notNullable();
            table.string("currency", 10).notNullable().defaultTo("NGN");
            table.boolean("is_default").defaultTo("true").notNullable();
            table.timestamps({
                useCamelCase: true,
                defaultToNow: true,
                useTimestamps: true,
            });
        });
        yield knex.schema.createTable("transaction", (table) => {
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
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTableIfExists("users");
        yield knex.schema.dropTableIfExists("wallet");
        yield knex.schema.dropTableIfExists("transaction");
    });
}
