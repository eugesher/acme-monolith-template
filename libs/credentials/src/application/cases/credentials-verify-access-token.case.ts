import { Inject, Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type { ICredentialsVerifyAccessTokenView } from '@acme-libs/contracts/credentials';

import { CREDENTIALS_ACCESS_TOKEN_PORT, type ICredentialsAccessTokenPort } from '../../outbound';

@Injectable()
export class CredentialsVerifyAccessTokenCase {
  constructor(
    @Inject(CREDENTIALS_ACCESS_TOKEN_PORT)
    private readonly accessToken: ICredentialsAccessTokenPort,
  ) {}

  public async execute(token: string): Promise<Nullable<ICredentialsVerifyAccessTokenView>> {
    return await this.accessToken.verify(token);
  }
}
