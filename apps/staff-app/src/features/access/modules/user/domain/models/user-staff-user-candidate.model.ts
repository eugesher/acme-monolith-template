import { UserStatusEnum } from '@acme-libs/kernel';
import { EmailValue } from '@acme-core/domain';

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

  private static readonly MIN_PASSWORD_LENGTH = 12;

  private constructor(
    private readonly email: EmailValue,
    private readonly passwordHash: string,
    private readonly roleIds: readonly string[],
  ) {}

  public static create(proposal: IUserStaffUserCandidateCreate): UserStaffUserCandidateModel {
    const { email, passwordHash, roleIds } = proposal;
    const userEmail = EmailValue.create(email);

    return new UserStaffUserCandidateModel(userEmail, passwordHash, [...new Set(roleIds)]);
  }

  public static assertPasswordStrength(password: string): void {
    if (password.length < UserStaffUserCandidateModel.MIN_PASSWORD_LENGTH) {
      throw new UserPasswordTooWeakException(UserStaffUserCandidateModel.MIN_PASSWORD_LENGTH);
    }
  }

  public assertEmail(): void {
    if (!this.email.isValid()) {
      throw new UserEmailInvalidException();
    }
  }

  public toInsertPayload(): IUserStaffUserCandidateInsertPayload {
    return {
      email: this.email.address,
      passwordHash: this.passwordHash,
      status: UserStatusEnum.ACTIVE,
    };
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
    return { id, email: this.email.address };
  }
}
