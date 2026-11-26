import { Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  ICredentialsPort,
  ICredentialsSignAccessTokenCommand,
  ICredentialsVerifyAccessTokenView,
  ICredentialsVerifyPasswordCommand,
} from '@acme-libs/contracts/credentials';

import {
  CredentialsHashPasswordUseCase,
  CredentialsSignAccessTokenUseCase,
  CredentialsVerifyAccessTokenUseCase,
  CredentialsVerifyPasswordUseCase,
} from '../application';

@Injectable()
export class CredentialsFacade implements ICredentialsPort {
  constructor(
    private readonly signAccessToken: CredentialsSignAccessTokenUseCase,
    private readonly verifyAccessToken: CredentialsVerifyAccessTokenUseCase,
    private readonly hashPassword: CredentialsHashPasswordUseCase,
    private readonly verifyPassword: CredentialsVerifyPasswordUseCase,
  ) {}

  public async handleSignAccessToken(command: ICredentialsSignAccessTokenCommand): Promise<string> {
    return await this.signAccessToken.execute(command);
  }

  public async handleVerifyAccessToken(
    token: string,
  ): Promise<Nullable<ICredentialsVerifyAccessTokenView>> {
    return await this.verifyAccessToken.execute(token);
  }

  public async handleHashPassword(password: string): Promise<string> {
    return await this.hashPassword.execute(password);
  }

  public async handleVerifyPassword(command: ICredentialsVerifyPasswordCommand): Promise<boolean> {
    return await this.verifyPassword.execute(command);
  }
}
