import { Injectable, type ClassProvider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  ICredentialsSignAccessTokenCommand,
  ICredentialsVerifyAccessTokenView,
} from '@acme-libs/contracts/credentials';

import { CREDENTIALS_ACCESS_TOKEN_PORT, type ICredentialsAccessTokenPort } from '../../outbound';

@Injectable()
export class CredentialsAccessTokenAdapter implements ICredentialsAccessTokenPort {
  public static readonly provider: ClassProvider<ICredentialsAccessTokenPort> = {
    provide: CREDENTIALS_ACCESS_TOKEN_PORT,
    useClass: CredentialsAccessTokenAdapter,
  };

  constructor(private readonly jwt: JwtService) {}

  public async sign(command: ICredentialsSignAccessTokenCommand): Promise<string> {
    const { sub } = command;

    return await this.jwt.signAsync({ sub });
  }

  public async verify(token: string): Promise<Nullable<ICredentialsVerifyAccessTokenView>> {
    const claims = await this.jwt
      .verifyAsync<ICredentialsVerifyAccessTokenView>(token)
      .catch(() => null);

    if (!claims) {
      return null;
    }

    const { sub } = claims;

    return { sub };
  }
}
