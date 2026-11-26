import { UserStatusEnum } from '@acme-libs/kernel';

import { AuthUserInactiveException } from '../errors';
import type { IAuthStaffUserLoginLoggerPayload, IAuthStaffUserLoginReconstitute } from '../types';

export class AuthStaffUserLoginModel {
  private constructor(
    public readonly id: string,
    public readonly passwordHash: string,
    private readonly status: UserStatusEnum,
  ) {}

  public static reconstitute(record: IAuthStaffUserLoginReconstitute): AuthStaffUserLoginModel {
    const { id, passwordHash, status } = record;

    return new AuthStaffUserLoginModel(id, passwordHash, status);
  }

  public assertActive(): void {
    if (this.status !== UserStatusEnum.ACTIVE) {
      throw new AuthUserInactiveException(this.id);
    }
  }

  public toLoggerPayload(): IAuthStaffUserLoginLoggerPayload {
    return { id: this.id };
  }
}
