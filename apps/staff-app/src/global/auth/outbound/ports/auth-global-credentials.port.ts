import type { Nullable } from '@acme-libs/toolkit';

export interface IAuthGlobalCredentialsPort {
  verifyAccessToken(token: string): Promise<Nullable<string>>;
}

export const AUTH_GLOBAL_CREDENTIALS_PORT = Symbol('AUTH_GLOBAL_CREDENTIALS_PORT');
