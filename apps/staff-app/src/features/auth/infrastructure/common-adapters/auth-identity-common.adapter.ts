import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import {
  STAFF_AUTH_COMMON_PORT,
  type IStaffAuthCommonPort,
} from '@acme-staff/contracts/staff-auth';
import type { Nullable } from '@acme-libs/toolkit';

import {
  AUTH_IDENTITY_PORT,
  type IAuthIdentityFindSubjectCommand,
  type IAuthIdentityPort,
  type IAuthIdentitySubjectView,
} from '../../outbound';

@Injectable()
export class AuthIdentityCommonAdapter implements IAuthIdentityPort {
  public static readonly provider: ClassProvider<IAuthIdentityPort> = {
    provide: AUTH_IDENTITY_PORT,
    useClass: AuthIdentityCommonAdapter,
  };

  constructor(
    @Inject(STAFF_AUTH_COMMON_PORT)
    private readonly staffAuthCore: IStaffAuthCommonPort,
  ) {}

  public async findSubject(
    command: IAuthIdentityFindSubjectCommand,
  ): Promise<Nullable<IAuthIdentitySubjectView>> {
    const { userId } = command;
    const subject = await this.staffAuthCore.handleFindSubject({ userId });

    return subject ? { id: subject.id, email: subject.email, roles: subject.roles } : null;
  }
}
