import type { Nullable } from '@acme-libs/toolkit';
import type {
  ICredentialsLibSignAccessTokenCommand,
  ICredentialsLibVerifyAccessTokenView,
} from '@acme-libs/contracts/credentials';

export interface ICredentialsLibAccessTokenPort {
  sign(command: ICredentialsLibSignAccessTokenCommand): Promise<string>;
  verify(token: string): Promise<Nullable<ICredentialsLibVerifyAccessTokenView>>;
}

export const CREDENTIALS_LIB_ACCESS_TOKEN_PORT = Symbol('CREDENTIALS_LIB_ACCESS_TOKEN_PORT');
