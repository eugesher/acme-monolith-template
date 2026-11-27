import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { CREDENTIALS_PORT, type ICredentialsPort } from '@acme-libs/contracts/credentials';

import {
  AUTH_CREDENTIALS_PORT,
  type IAuthCredentialsPort,
  type IAuthCredentialsVerifyPasswordCommand,
} from '../../outbound';

@Injectable()
export class AuthCredentialsLibAdapter implements IAuthCredentialsPort {
  public static readonly PROVIDER: ClassProvider<IAuthCredentialsPort> = {
    provide: AUTH_CREDENTIALS_PORT,
    useClass: AuthCredentialsLibAdapter,
  };

  constructor(
    @Inject(CREDENTIALS_PORT)
    private readonly credentials: ICredentialsPort,
  ) {}

  public async issueAccessToken(userId: string): Promise<string> {
    return await this.credentials.signAccessToken({ sub: userId });
  }

  public async verifyPassword(command: IAuthCredentialsVerifyPasswordCommand): Promise<boolean> {
    const { passwordHash, password } = command;

    return await this.credentials.verifyPassword({ passwordHash, password });
  }
}
