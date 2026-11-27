import { Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  IAuthAccessTokenCommand,
  IAuthCurrentUserView,
  IAuthUserValidatorPort,
} from '@acme-libs/contracts/auth';

import { AuthGlobalValidateSubjectCase } from '../application';

@Injectable()
export class AuthGlobalFacade implements IAuthUserValidatorPort {
  constructor(private readonly validateSubjectCase: AuthGlobalValidateSubjectCase) {}

  public async validateSubject(
    command: IAuthAccessTokenCommand,
  ): Promise<Nullable<IAuthCurrentUserView>> {
    const { token } = command;

    return await this.validateSubjectCase.execute({ token });
  }
}
