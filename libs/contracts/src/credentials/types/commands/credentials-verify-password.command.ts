import type { Nullable } from '@acme-libs/toolkit';

export interface ICredentialsVerifyPasswordCommand {
  passwordHash: Nullable<string>;
  password: string;
}
