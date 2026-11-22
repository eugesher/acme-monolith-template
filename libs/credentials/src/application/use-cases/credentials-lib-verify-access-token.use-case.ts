import { Inject, Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type { ICredentialsLibVerifyAccessTokenView } from '@acme-libs/contracts/credentials';

import {
  CREDENTIALS_LIB_ACCESS_TOKEN_PORT,
  type ICredentialsLibAccessTokenPort,
} from '../../outbound';

@Injectable()
export class CredentialsLibVerifyAccessTokenUseCase {
  constructor(
    @Inject(CREDENTIALS_LIB_ACCESS_TOKEN_PORT)
    private readonly accessToken: ICredentialsLibAccessTokenPort,
  ) {}

  public async execute(token: string): Promise<Nullable<ICredentialsLibVerifyAccessTokenView>> {
    return await this.accessToken.verify(token);
  }
}
