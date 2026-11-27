import { Inject, Injectable } from '@nestjs/common';

import type { ICredentialsSignAccessTokenCommand } from '@acme-libs/contracts/credentials';

import { CREDENTIALS_ACCESS_TOKEN_PORT, type ICredentialsAccessTokenPort } from '../../outbound';

@Injectable()
export class CredentialsSignAccessTokenCase {
  constructor(
    @Inject(CREDENTIALS_ACCESS_TOKEN_PORT)
    private readonly accessToken: ICredentialsAccessTokenPort,
  ) {}

  public async execute(command: ICredentialsSignAccessTokenCommand): Promise<string> {
    return await this.accessToken.sign(command);
  }
}
