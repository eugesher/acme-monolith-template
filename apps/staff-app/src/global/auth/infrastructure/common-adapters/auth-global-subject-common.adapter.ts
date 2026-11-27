import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { AUTH_COMMON_PORT, type IAuthCommonPort } from '@acme-staff/contracts/auth';
import type { Nullable } from '@acme-libs/toolkit';

import {
  AUTH_GLOBAL_SUBJECT_PORT,
  type IAuthGlobalSubjectFindSubjectCommand,
  type IAuthGlobalSubjectPort,
  type IAuthGlobalSubjectView,
} from '../../outbound';

@Injectable()
export class AuthGlobalSubjectCommonAdapter implements IAuthGlobalSubjectPort {
  public static readonly PROVIDER: ClassProvider<IAuthGlobalSubjectPort> = {
    provide: AUTH_GLOBAL_SUBJECT_PORT,
    useClass: AuthGlobalSubjectCommonAdapter,
  };

  constructor(
    @Inject(AUTH_COMMON_PORT)
    private readonly authCommon: IAuthCommonPort,
  ) {}

  public async findSubject(
    command: IAuthGlobalSubjectFindSubjectCommand,
  ): Promise<Nullable<IAuthGlobalSubjectView>> {
    const { userId } = command;
    const subject = await this.authCommon.findSubject({ userId });

    if (!subject) {
      return null;
    }

    const { id, email, permissionCodes } = subject;

    return { id, email, permissionCodes };
  }
}
