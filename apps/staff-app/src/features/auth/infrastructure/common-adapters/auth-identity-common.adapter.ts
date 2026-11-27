import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { AUTH_COMMON_PORT, type IAuthCommonPort } from '@acme-staff/contracts/auth';
import type { Nullable } from '@acme-libs/toolkit';

import {
  AUTH_IDENTITY_PORT,
  type IAuthIdentityFindSubjectCommand,
  type IAuthIdentityPort,
  type IAuthIdentitySubjectView,
} from '../../outbound';

@Injectable()
export class AuthIdentityCommonAdapter implements IAuthIdentityPort {
  public static readonly PROVIDER: ClassProvider<IAuthIdentityPort> = {
    provide: AUTH_IDENTITY_PORT,
    useClass: AuthIdentityCommonAdapter,
  };

  constructor(
    @Inject(AUTH_COMMON_PORT)
    private readonly authCommon: IAuthCommonPort,
  ) {}

  public async findSubject(
    command: IAuthIdentityFindSubjectCommand,
  ): Promise<Nullable<IAuthIdentitySubjectView>> {
    const { userId } = command;
    const subject = await this.authCommon.findSubject({ userId });

    return subject ? { id: subject.id, email: subject.email, roles: subject.roles } : null;
  }
}
