import type { Nullable } from '@acme-libs/toolkit';

import type {
  ICredentialsSignAccessTokenCommand,
  ICredentialsVerifyAccessTokenView,
  ICredentialsVerifyPasswordCommand,
} from '../types';

export interface ICredentialsPort {
  handleSignAccessToken(command: ICredentialsSignAccessTokenCommand): Promise<string>;
  handleVerifyAccessToken(token: string): Promise<Nullable<ICredentialsVerifyAccessTokenView>>;
  handleHashPassword(password: string): Promise<string>;
  handleVerifyPassword(command: ICredentialsVerifyPasswordCommand): Promise<boolean>;
}

export const CREDENTIALS_PORT = Symbol('CREDENTIALS_PORT');
