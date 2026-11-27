import { Inject, Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  AUTH_GLOBAL_CREDENTIALS_PORT,
  AUTH_GLOBAL_SUBJECT_PORT,
  type IAuthGlobalCredentialsPort,
  type IAuthGlobalSubjectPort,
} from '../../outbound';
import type { IAuthGlobalValidateSubjectCommand, IAuthGlobalValidateSubjectView } from '../types';

@Injectable()
export class AuthGlobalValidateSubjectCase {
  constructor(
    @Inject(AUTH_GLOBAL_SUBJECT_PORT)
    private readonly subject: IAuthGlobalSubjectPort,
    @Inject(AUTH_GLOBAL_CREDENTIALS_PORT)
    private readonly credentials: IAuthGlobalCredentialsPort,
  ) {}

  public async execute(
    command: IAuthGlobalValidateSubjectCommand,
  ): Promise<Nullable<IAuthGlobalValidateSubjectView>> {
    const { token } = command;
    const userId = await this.credentials.verifyAccessToken(token);

    if (!userId) {
      return null;
    }

    return await this.subject.findSubject({ userId });
  }
}
