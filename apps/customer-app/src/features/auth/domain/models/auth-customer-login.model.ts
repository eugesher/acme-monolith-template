import { UserStatusEnum } from '@acme-libs/kernel';

import { AuthUserInactiveException } from '../exceptions/auth-user-inactive.exception';
import type {
  IAuthCustomerLoginLoggerPayload,
  IAuthCustomerLoginReconstitute,
} from '../interfaces';

export class AuthCustomerLoginModel {
  private constructor(
    public readonly id: string,
    public readonly passwordHash: string,
    public readonly status: UserStatusEnum,
  ) {}

  public static reconstitute(record: IAuthCustomerLoginReconstitute): AuthCustomerLoginModel {
    const { id, passwordHash, status } = record;

    return new AuthCustomerLoginModel(id, passwordHash, status);
  }

  public static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  public toLoggerPayload(): IAuthCustomerLoginLoggerPayload {
    return { id: this.id };
  }

  public assertActive(): void {
    if (this.status !== UserStatusEnum.ACTIVE) {
      throw new AuthUserInactiveException(this.id);
    }
  }
}
