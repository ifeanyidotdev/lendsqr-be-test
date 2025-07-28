export class ErrorCode {
	static VALIDATION_ERROR = "VALIDATION_ERROR";
	static SERVER_ERROR = "INTERNAL_SERVER_ERROR";
	static TOKEN_ERROR = "INVALID_EXPIRED_TOKEN";
	static SUCCESS = "SUCCESS";
}

export class TokenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "TokenError";
		Object.setPrototypeOf(this, TokenError.prototype);
	}
}
export class ApplicationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ApplicationError";
		Object.setPrototypeOf(this, ApplicationError.prototype);
	}
}
