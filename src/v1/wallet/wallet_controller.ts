import WalletService from "./wallet_service";

class WalletController {
	private service: WalletService;

	constructor(service: WalletService) {
		this.service = service;
	}
}

const walletService = new WalletService();
export default new WalletController(walletService);
