import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { CREDENTIALS_PORT, type ICredentialsPort } from '@acme-libs/contracts/credentials';

import {
  AUTH_CREDENTIALS_PORT,
  type IAuthCredentialsPort,
  type IAuthCredentialsVerifyPasswordCommand,
} from '../../outbound';

@Injectable()
export class AuthCredentialsLibAdapter implements IAuthCredentialsPort {
  public static readonly provider: ClassProvider<IAuthCredentialsPort> = {
    provide: AUTH_CREDENTIALS_PORT,
    useClass: AuthCredentialsLibAdapter,
  };

  constructor(
    @Inject(CREDENTIALS_PORT)
    private readonly credentials: ICredentialsPort,
  ) {}

  public async issueAccessToken(customerId: string): Promise<string> {
    return await this.credentials.handleSignAccessToken({ sub: customerId });
  }

  public async hashPassword(password: string): Promise<string> {
    return await this.credentials.handleHashPassword(password);
  }

  public async verifyPassword(command: IAuthCredentialsVerifyPasswordCommand): Promise<boolean> {
    const { passwordHash, password } = command;

    return await this.credentials.handleVerifyPassword({ passwordHash, password });
  }
}
