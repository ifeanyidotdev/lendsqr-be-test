import { Knex } from "knex";
import { knexClient } from "../../db";

export default class WalletService {
	private client: Knex;
	constructor() {
		this.client = knexClient;
	}
}
