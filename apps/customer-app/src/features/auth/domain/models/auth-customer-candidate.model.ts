import { UserStatusEnum } from '@acme-libs/kernel';
import { EmailValue } from '@acme-core/domain';

import { AuthEmailInvalidException } from '../exceptions/auth-email-invalid.exception';
import { AuthPasswordTooWeakException } from '../exceptions/auth-password-too-weak.exception';
import type {
  IAuthCustomerCandidateCreate,
  IAuthCustomerCandidateInsertPayload,
  IAuthCustomerRegisterReconstitute,
} from '../interfaces';

export class AuthCustomerCandidateModel {
  private static readonly MIN_PASSWORD_LENGTH = 12;

  private constructor(
    private readonly email: EmailValue,
    private readonly passwordHash: string,
  ) {}

  public static create(proposal: IAuthCustomerCandidateCreate): AuthCustomerCandidateModel {
    const { email, passwordHash } = proposal;
    const customerEmail = EmailValue.create(email);

    return new AuthCustomerCandidateModel(customerEmail, passwordHash);
  }

  public static assertPasswordStrength(password: string): void {
    if (password.length < AuthCustomerCandidateModel.MIN_PASSWORD_LENGTH) {
      throw new AuthPasswordTooWeakException(AuthCustomerCandidateModel.MIN_PASSWORD_LENGTH);
    }
  }

  public assertEmail(): void {
    if (!this.email.isValid()) {
      throw new AuthEmailInvalidException();
    }
  }

  public toInsertPayload(): IAuthCustomerCandidateInsertPayload {
    return {
      email: this.email.address,
      passwordHash: this.passwordHash,
      status: UserStatusEnum.ACTIVE,
    };
  }

  public toRegistered(id: string): IAuthCustomerRegisterReconstitute {
    return { id, email: this.email.address };
  }
}
