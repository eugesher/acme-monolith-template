import { UserStatusEnum } from '@acme-libs/kernel';

import { UserEmailInvalidException } from '../exceptions/user-email-invalid.exception';
import { UserPasswordTooWeakException } from '../exceptions/user-password-too-weak.exception';
import { UserRoleNotFoundException } from '../exceptions/user-role-not-found.exception';
import type {
  IUserStaffUserCandidateCreate,
  IUserStaffUserCandidateInsertPayload,
  IUserStaffUserRegisterReconstitute,
  IUserStaffUserRole,
  IUserStaffUserStoredRole,
} from '../interfaces';

export class UserStaffUserCandidateModel {
  public get distinctRoleIds(): readonly string[] {
    return this.roleIds;
  }

  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 12;

  private constructor(
    private email: string,
    private readonly passwordHash: string,
    private readonly roleIds: readonly string[],
  ) {}

  public static create(proposal: IUserStaffUserCandidateCreate): UserStaffUserCandidateModel {
    const { email, passwordHash, roleIds } = proposal;

    return new UserStaffUserCandidateModel(email, passwordHash, [...new Set(roleIds)]);
  }

  public static assertPasswordStrength(password: string): void {
    if (password.length < UserStaffUserCandidateModel.MIN_PASSWORD_LENGTH) {
      throw new UserPasswordTooWeakException(UserStaffUserCandidateModel.MIN_PASSWORD_LENGTH);
    }
  }

  public normalizeEmail(): void {
    this.email = this.email.trim().toLowerCase();
  }

  public assertEmail(): void {
    if (!UserStaffUserCandidateModel.EMAIL_PATTERN.test(this.email)) {
      throw new UserEmailInvalidException();
    }
  }

  public toInsertPayload(): IUserStaffUserCandidateInsertPayload {
    return { email: this.email, passwordHash: this.passwordHash, status: UserStatusEnum.ACTIVE };
  }

  public assertRoles(storedRoles: IUserStaffUserStoredRole[]): void {
    for (const roleId of this.roleIds) {
      const isRoleStored = storedRoles.some((storedRole) => storedRole.id === roleId);

      if (!isRoleStored) {
        throw new UserRoleNotFoundException(roleId);
      }
    }
  }

  public createUserRoles(userId: string): IUserStaffUserRole[] {
    return this.roleIds.map((roleId) => ({ userId, roleId }));
  }

  public toRegistered(id: string): IUserStaffUserRegisterReconstitute {
    return { id, email: this.email };
  }
}
