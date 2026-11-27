import { Inject, Injectable } from '@nestjs/common';

import type { ICredentialsVerifyPasswordCommand } from '@acme-libs/contracts/credentials';

import {
  CREDENTIALS_PASSWORD_HASHER_PORT,
  type ICredentialsPasswordHasherPort,
} from '../../outbound';

@Injectable()
export class CredentialsVerifyPasswordCase {
  constructor(
    @Inject(CREDENTIALS_PASSWORD_HASHER_PORT)
    private readonly passwordHasher: ICredentialsPasswordHasherPort,
  ) {}

  public async execute(command: ICredentialsVerifyPasswordCommand): Promise<boolean> {
    return await this.passwordHasher.verify(command);
  }
}
