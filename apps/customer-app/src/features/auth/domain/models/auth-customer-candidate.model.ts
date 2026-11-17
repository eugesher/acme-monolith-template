import { UserStatusEnum } from '@acme-libs/kernel';

import { AuthEmailInvalidException } from '../exceptions/auth-email-invalid.exception';
import { AuthPasswordTooWeakException } from '../exceptions/auth-password-too-weak.exception';
import { AuthCustomerModel } from './auth-customer.model';
import type {
  IAuthCustomerCandidateCreate,
  IAuthCustomerCandidateInsertPayload,
  IAuthCustomerRegisterLedgerPayload,
  IAuthCustomerRegisterSnapshot,
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
    const normalizedEmail = AuthCustomerModel.normalizeEmail(email);

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

  public toSnapshot(id: string): IAuthCustomerRegisterSnapshot {
    return { id, email: this.email };
  }

  public toLedgerPayload(id: string): IAuthCustomerRegisterLedgerPayload {
    return { subjectId: id };
  }
}
