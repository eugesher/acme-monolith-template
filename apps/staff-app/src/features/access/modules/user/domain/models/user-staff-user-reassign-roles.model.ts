import { UserRoleNotFoundException } from '../exceptions/user-role-not-found.exception';
import type {
  IUserStaffUserReassignRolesCreate,
  IUserStaffUserReassignRolesLoggerPayload,
  IUserStaffUserReassignRolesSnapshot,
  IUserStaffUserRole,
  IUserStaffUserStoredRole,
} from '../interfaces';

export class UserStaffUserReassignRolesModel {
  private constructor(
    private readonly userId: string,
    private readonly roleIds: readonly string[],
  ) {}

  public static create(
    proposal: IUserStaffUserReassignRolesCreate,
  ): UserStaffUserReassignRolesModel {
    const { userId, roleIds } = proposal;

    return new UserStaffUserReassignRolesModel(userId, roleIds);
  }

  public assertRoles(storedRoles: IUserStaffUserStoredRole[]): void {
    for (const roleId of this.roleIds) {
      const isRoleStored = storedRoles.some((storedRole) => storedRole.id === roleId);

      if (!isRoleStored) {
        throw new UserRoleNotFoundException(roleId);
      }
    }
  }

  public getUserRoles(): IUserStaffUserRole[] {
    return this.roleIds.map((roleId) => ({ userId: this.userId, roleId }));
  }

  public toSnapshot(): IUserStaffUserReassignRolesSnapshot {
    return { id: this.userId, roleIds: this.roleIds };
  }

  public toLoggerPayload(): IUserStaffUserReassignRolesLoggerPayload {
    const userRoles = this.roleIds.map((roleId) => ({ roleId }));

    return { id: this.userId, userRoles };
  }
}
