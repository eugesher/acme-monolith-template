import { UserStatusEnum } from '@acme-libs/kernel';

import { AuthUserInactiveException } from '../exceptions/auth-user-inactive.exception';
import type { IAuthCustomerLoginLoggerPayload, IAuthCustomerReconstitute } from '../interfaces';

export class AuthCustomerModel {
  private constructor(
    public readonly id: string,
    public readonly passwordHash: string,
    public readonly status: UserStatusEnum,
  ) {}

  public static reconstitute(record: IAuthCustomerReconstitute): AuthCustomerModel {
    const { id, passwordHash, status } = record;

    return new AuthCustomerModel(id, passwordHash, status);
  }

  public static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  public toLoginLoggerPayload(): IAuthCustomerLoginLoggerPayload {
    return { id: this.id };
  }

  public assertActive(): void {
    if (this.status !== UserStatusEnum.ACTIVE) {
      throw new AuthUserInactiveException(this.id);
    }
  }
}
