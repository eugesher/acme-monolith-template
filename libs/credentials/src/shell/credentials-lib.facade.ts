import { Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  ICredentialsLibPort,
  ICredentialsLibSignAccessTokenCommand,
  ICredentialsLibVerifyAccessTokenView,
  ICredentialsLibVerifyPasswordCommand,
} from '@acme-libs/contracts/credentials';

import {
  CredentialsLibHashPasswordUseCase,
  CredentialsLibSignAccessTokenUseCase,
  CredentialsLibVerifyAccessTokenUseCase,
  CredentialsLibVerifyPasswordUseCase,
} from '../application';

@Injectable()
export class CredentialsLibFacade implements ICredentialsLibPort {
  constructor(
    private readonly signAccessToken: CredentialsLibSignAccessTokenUseCase,
    private readonly verifyAccessToken: CredentialsLibVerifyAccessTokenUseCase,
    private readonly hashPassword: CredentialsLibHashPasswordUseCase,
    private readonly verifyPassword: CredentialsLibVerifyPasswordUseCase,
  ) {}

  public async handleSignAccessToken(
    command: ICredentialsLibSignAccessTokenCommand,
  ): Promise<string> {
    return await this.signAccessToken.execute(command);
  }

  public async handleVerifyAccessToken(
    token: string,
  ): Promise<Nullable<ICredentialsLibVerifyAccessTokenView>> {
    return await this.verifyAccessToken.execute(token);
  }

  public async handleHashPassword(password: string): Promise<string> {
    return await this.hashPassword.execute(password);
  }

  public async handleVerifyPassword(
    command: ICredentialsLibVerifyPasswordCommand,
  ): Promise<boolean> {
    return await this.verifyPassword.execute(command);
  }
}
