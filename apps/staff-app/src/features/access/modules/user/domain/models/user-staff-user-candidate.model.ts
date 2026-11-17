import { UserStatusEnum } from '@acme-libs/kernel';

import { AuthEmailInvalidException } from '../exceptions/auth-email-invalid.exception';
import { AuthPasswordTooWeakException } from '../exceptions/auth-password-too-weak.exception';
import { AuthRoleNotFoundException } from '../exceptions/auth-role-not-found.exception';
import type {
  IUserRegisterLoggerPayload,
  IUserRegisterSnapshot,
  IUserStaffUserCandidateCreate,
  IUserStaffUserCandidateInsertQuery,
  IUserStaffUserRole,
  IUserStaffUserStoredRole,
} from '../interfaces';

export class UserStaffUserCandidateModel {
  public get distinctRoleIds(): string[] {
    return [...this.roleIds];
  }

  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 12;

  private constructor(
    private readonly email: string,
    private readonly passwordHash: string,
    private readonly roleIds: readonly string[],
  ) {}

  public static create(proposal: IUserStaffUserCandidateCreate): UserStaffUserCandidateModel {
    const { email, passwordHash, roleIds } = proposal;
    const normalizedEmail = UserStaffUserCandidateModel.normalizeEmail(email);

    if (!UserStaffUserCandidateModel.EMAIL_PATTERN.test(normalizedEmail)) {
      throw new AuthEmailInvalidException();
    }

    return new UserStaffUserCandidateModel(normalizedEmail, passwordHash, [...new Set(roleIds)]);
  }

  public static assertPasswordStrength(password: string): void {
    if (password.length < UserStaffUserCandidateModel.MIN_PASSWORD_LENGTH) {
      throw new AuthPasswordTooWeakException(UserStaffUserCandidateModel.MIN_PASSWORD_LENGTH);
    }
  }

  public toInsertQuery(): IUserStaffUserCandidateInsertQuery {
    return { email: this.email, passwordHash: this.passwordHash, status: UserStatusEnum.ACTIVE };
  }

  public assertRoles(storedRoles: IUserStaffUserStoredRole[]): void {
    for (const roleId of this.roleIds) {
      const isRoleStored = storedRoles.some((storedRole) => storedRole.id === roleId);

      if (!isRoleStored) {
        throw new AuthRoleNotFoundException(roleId);
      }
    }
  }

  public getUserRoles(userId: string): IUserStaffUserRole[] {
    return this.roleIds.map((roleId) => ({ userId, roleId }));
  }

  public toSnapshot(id: string): IUserRegisterSnapshot {
    return { id, email: this.email };
  }

  public toLoggerPayload(id: string): IUserRegisterLoggerPayload {
    return { id };
  }

  private static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
