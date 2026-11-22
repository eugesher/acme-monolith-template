import type { Nullable } from '@acme-libs/toolkit';

import type {
  ICredentialsLibSignAccessTokenCommand,
  ICredentialsLibVerifyAccessTokenView,
  ICredentialsLibVerifyPasswordCommand,
} from '../interfaces';

export interface ICredentialsLibPort {
  handleSignAccessToken(command: ICredentialsLibSignAccessTokenCommand): Promise<string>;
  handleVerifyAccessToken(token: string): Promise<Nullable<ICredentialsLibVerifyAccessTokenView>>;
  handleHashPassword(password: string): Promise<string>;
  handleVerifyPassword(command: ICredentialsLibVerifyPasswordCommand): Promise<boolean>;
}

export const CREDENTIALS_LIB_PORT = Symbol('CREDENTIALS_LIB_PORT');
