import type { Nullable } from '@acme-libs/toolkit';
import type {
  ICredentialsSignAccessTokenCommand,
  ICredentialsVerifyAccessTokenView,
} from '@acme-libs/contracts/credentials';

export interface ICredentialsAccessTokenPort {
  sign(command: ICredentialsSignAccessTokenCommand): Promise<string>;
  verify(token: string): Promise<Nullable<ICredentialsVerifyAccessTokenView>>;
}

export const CREDENTIALS_ACCESS_TOKEN_PORT = Symbol('CREDENTIALS_ACCESS_TOKEN_PORT');
