import { UserStatusEnum } from '@acme-libs/kernel';

import { AuthEmailInvalidException } from '../exceptions/auth-email-invalid.exception';
import { AuthPasswordTooWeakException } from '../exceptions/auth-password-too-weak.exception';
import type {
  IAuthCustomerCandidateCreate,
  IAuthCustomerCandidateInsertPayload,
  IAuthCustomerRegisterReconstitute,
} from '../interfaces';

export class AuthCustomerCandidateModel {
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 12;

  private constructor(
    private readonly email: string,
    private readonly passwordHash: string,
  ) {}

  public static create(proposal: IAuthCustomerCandidateCreate): AuthCustomerCandidateModel {
    const { email, passwordHash } = proposal;
    const normalizedEmail = AuthCustomerCandidateModel.normalizeEmail(email);

    if (!AuthCustomerCandidateModel.EMAIL_PATTERN.test(normalizedEmail)) {
      throw new AuthEmailInvalidException();
    }

    return new AuthCustomerCandidateModel(normalizedEmail, passwordHash);
  }

  public static assertPasswordStrength(password: string): void {
    if (password.length < AuthCustomerCandidateModel.MIN_PASSWORD_LENGTH) {
      throw new AuthPasswordTooWeakException(AuthCustomerCandidateModel.MIN_PASSWORD_LENGTH);
    }
  }

  public toInsertPayload(): IAuthCustomerCandidateInsertPayload {
    return { email: this.email, passwordHash: this.passwordHash, status: UserStatusEnum.ACTIVE };
  }

  public toRegistered(id: string): IAuthCustomerRegisterReconstitute {
    return { id, email: this.email };
  }

  private static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
