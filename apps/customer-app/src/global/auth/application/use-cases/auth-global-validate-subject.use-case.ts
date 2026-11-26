import { Inject, Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  AUTH_GLOBAL_CREDENTIALS_PORT,
  AUTH_GLOBAL_VALIDATE_SUBJECT_REPOSITORY_PORT,
  type IAuthGlobalCredentialsPort,
  type IAuthGlobalValidateSubjectRepositoryPort,
} from '../../outbound';
import type { IAuthGlobalValidateSubjectCommand, IAuthGlobalValidateSubjectView } from '../types';

@Injectable()
export class AuthGlobalValidateSubjectUseCase {
  constructor(
    @Inject(AUTH_GLOBAL_VALIDATE_SUBJECT_REPOSITORY_PORT)
    private readonly repository: IAuthGlobalValidateSubjectRepositoryPort,
    @Inject(AUTH_GLOBAL_CREDENTIALS_PORT)
    private readonly credentials: IAuthGlobalCredentialsPort,
  ) {}

  public async execute(
    command: IAuthGlobalValidateSubjectCommand,
  ): Promise<Nullable<IAuthGlobalValidateSubjectView>> {
    const { token } = command;
    const customerId = await this.credentials.verifyAccessToken(token);

    if (!customerId) {
      return null;
    }

    return await this.repository.findActiveOne(customerId);
  }
}
