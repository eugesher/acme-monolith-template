import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { CREDENTIALS_LIB_PORT, type ICredentialsLibPort } from '@acme-libs/contracts/credentials';
import type { Nullable } from '@acme-libs/toolkit';

import { AUTH_GLOBAL_CREDENTIALS_PORT, type IAuthGlobalCredentialsPort } from '../../outbound';

@Injectable()
export class AuthGlobalCredentialsLibAdapter implements IAuthGlobalCredentialsPort {
  public static readonly provider: ClassProvider<IAuthGlobalCredentialsPort> = {
    provide: AUTH_GLOBAL_CREDENTIALS_PORT,
    useClass: AuthGlobalCredentialsLibAdapter,
  };

  constructor(
    @Inject(CREDENTIALS_LIB_PORT)
    private readonly credentials: ICredentialsLibPort,
  ) {}

  public async verifyAccessToken(token: string): Promise<Nullable<string>> {
    const claims = await this.credentials.handleVerifyAccessToken(token);

    return claims?.sub ?? null;
  }
}
