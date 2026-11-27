import type { Nullable } from '@acme-libs/toolkit';

import type {
  ICredentialsSignAccessTokenCommand,
  ICredentialsVerifyAccessTokenView,
  ICredentialsVerifyPasswordCommand,
} from '../types';

export interface ICredentialsPort {
  signAccessToken(command: ICredentialsSignAccessTokenCommand): Promise<string>;
  verifyAccessToken(token: string): Promise<Nullable<ICredentialsVerifyAccessTokenView>>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(command: ICredentialsVerifyPasswordCommand): Promise<boolean>;
}

export const CREDENTIALS_PORT = Symbol('CREDENTIALS_PORT');
