import { Context as HonoContext } from 'hono';
import { SignupSchemaType, SigninSchemaType } from '../v1/authentication/auth_schema';
import { DepositSchemaType, TransferSchemaType } from '../v1/wallet/wallet_schema';

declare module 'hono' {
  interface Context extends HonoContext {
    get(key: 'jwtPayload'): {
      userId: string;
      email: string;
    };
    req: {
      valid(target: 'json'):
        | SignupSchemaType
        | SigninSchemaType
        | DepositSchemaType
        | TransferSchemaType;
    };
  }
}
