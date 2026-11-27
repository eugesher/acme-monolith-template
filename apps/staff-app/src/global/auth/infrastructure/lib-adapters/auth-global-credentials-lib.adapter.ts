import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { CREDENTIALS_PORT, type ICredentialsPort } from '@acme-libs/contracts/credentials';
import type { Nullable } from '@acme-libs/toolkit';

import { AUTH_GLOBAL_CREDENTIALS_PORT, type IAuthGlobalCredentialsPort } from '../../outbound';

@Injectable()
export class AuthGlobalCredentialsLibAdapter implements IAuthGlobalCredentialsPort {
  public static readonly PROVIDER: ClassProvider<IAuthGlobalCredentialsPort> = {
    provide: AUTH_GLOBAL_CREDENTIALS_PORT,
    useClass: AuthGlobalCredentialsLibAdapter,
  };

  constructor(
    @Inject(CREDENTIALS_PORT)
    private readonly credentials: ICredentialsPort,
  ) {}

  public async verifyAccessToken(token: string): Promise<Nullable<string>> {
    const claims = await this.credentials.verifyAccessToken(token);

    return claims?.sub ?? null;
  }
}
