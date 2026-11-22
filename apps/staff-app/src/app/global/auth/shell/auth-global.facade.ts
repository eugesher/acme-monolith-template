import { Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  IAuthAccessTokenCommand,
  IAuthCurrentUserView,
  IAuthUserValidatorPort,
} from '@acme-libs/contracts/auth';

import { AuthGlobalValidateSubjectUseCase } from '../application';

@Injectable()
export class AuthGlobalFacade implements IAuthUserValidatorPort {
  constructor(private readonly validateSubject: AuthGlobalValidateSubjectUseCase) {}

  public async handleValidate(
    command: IAuthAccessTokenCommand,
  ): Promise<Nullable<IAuthCurrentUserView>> {
    const { token } = command;

    return await this.validateSubject.execute({ token });
  }
}
