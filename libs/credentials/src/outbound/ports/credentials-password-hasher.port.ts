import type { ICredentialsVerifyPasswordCommand } from '@acme-libs/contracts/credentials';

export interface ICredentialsPasswordHasherPort {
  hash(password: string): Promise<string>;
  verify(command: ICredentialsVerifyPasswordCommand): Promise<boolean>;
}

export const CREDENTIALS_PASSWORD_HASHER_PORT = Symbol('CREDENTIALS_PASSWORD_HASHER_PORT');
