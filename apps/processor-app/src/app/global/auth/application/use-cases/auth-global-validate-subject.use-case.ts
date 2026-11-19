import { Inject, Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import { AUTH_GLOBAL_SUBJECT_PORT, type IAuthGlobalSubjectPort } from '../../outbound';
import type {
  IAuthGlobalValidateSubjectCommand,
  IAuthGlobalValidateSubjectView,
} from '../interfaces';

@Injectable()
export class AuthGlobalValidateSubjectUseCase {
  constructor(
    @Inject(AUTH_GLOBAL_SUBJECT_PORT)
    private readonly subject: IAuthGlobalSubjectPort,
  ) {}

  public async execute(
    command: IAuthGlobalValidateSubjectCommand,
  ): Promise<Nullable<IAuthGlobalValidateSubjectView>> {
    const { userId } = command;

    return await this.subject.findSubject({ userId });
  }
}
