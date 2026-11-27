import { Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  ICredentialsPort,
  ICredentialsSignAccessTokenCommand,
  ICredentialsVerifyAccessTokenView,
  ICredentialsVerifyPasswordCommand,
} from '@acme-libs/contracts/credentials';

import {
  CredentialsHashPasswordCase,
  CredentialsSignAccessTokenCase,
  CredentialsVerifyAccessTokenCase,
  CredentialsVerifyPasswordCase,
} from '../application';

@Injectable()
export class CredentialsFacade implements ICredentialsPort {
  constructor(
    private readonly signAccessTokenCase: CredentialsSignAccessTokenCase,
    private readonly verifyAccessTokenCase: CredentialsVerifyAccessTokenCase,
    private readonly hashPasswordCase: CredentialsHashPasswordCase,
    private readonly verifyPasswordCase: CredentialsVerifyPasswordCase,
  ) {}

  public async signAccessToken(command: ICredentialsSignAccessTokenCommand): Promise<string> {
    return await this.signAccessTokenCase.execute(command);
  }

  public async verifyAccessToken(
    token: string,
  ): Promise<Nullable<ICredentialsVerifyAccessTokenView>> {
    return await this.verifyAccessTokenCase.execute(token);
  }

  public async hashPassword(password: string): Promise<string> {
    return await this.hashPasswordCase.execute(password);
  }

  public async verifyPassword(command: ICredentialsVerifyPasswordCommand): Promise<boolean> {
    return await this.verifyPasswordCase.execute(command);
  }
}
