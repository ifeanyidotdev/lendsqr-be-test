import { ContentfulStatusCode } from "hono/utils/http-status";

export class ErrorCode {
	static VALIDATION_ERROR = "VALIDATION_ERROR";
	static SERVER_ERROR = "INTERNAL_SERVER_ERROR";
	static TOKEN_ERROR = "INVALID_EXPIRED_TOKEN";
	static SUCCESS = "SUCCESS";
	static CREDENTIAL_ERROR = "CREDENTIAL_ERROR";
	static ACCOUNT_CREATION = "ACCOUNT_CREATION";
	static NOT_FOUND_ERROR = "NOT_FOUND_ERROR";
	static AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR";
}

export class TokenError extends Error {
	code: string;
	constructor(message: string, code: string) {
		super(message);
		this.name = "TokenError";
		this.code = code;
		Object.setPrototypeOf(this, TokenError.prototype);
	}
}
export class ApplicationError extends Error {
	code: string;
	status?: ContentfulStatusCode;
	constructor(message: string, code: string, status?: ContentfulStatusCode) {
		super(message);
		this.name = "ApplicationError";
		this.code = code;
		this.status = status;
		Object.setPrototypeOf(this, ApplicationError.prototype);
	}
}
