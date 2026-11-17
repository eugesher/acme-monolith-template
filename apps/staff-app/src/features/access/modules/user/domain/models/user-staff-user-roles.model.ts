import { AuthRoleNotFoundException } from '../exceptions/auth-role-not-found.exception';
import type {
  IUserReassignRolesLoggerPayload,
  IUserReassignRolesSnapshot,
  IUserStaffUserRole,
  IUserStaffUserRolesCreate,
  IUserStaffUserStoredRole,
} from '../interfaces';

export class UserStaffUserRolesModel {
  private constructor(
    private readonly userId: string,
    private readonly roleIds: readonly string[],
  ) {}

  public static create(proposal: IUserStaffUserRolesCreate): UserStaffUserRolesModel {
    const { userId, roleIds } = proposal;

    return new UserStaffUserRolesModel(userId, roleIds);
  }

  public assertRoles(storedRoles: IUserStaffUserStoredRole[]): void {
    for (const roleId of this.roleIds) {
      const isRoleStored = storedRoles.some((storedRole) => storedRole.id === roleId);

      if (!isRoleStored) {
        throw new AuthRoleNotFoundException(roleId);
      }
    }
  }

  public getUserRoles(): IUserStaffUserRole[] {
    return this.roleIds.map((roleId) => ({ userId: this.userId, roleId }));
  }

  public toSnapshot(): IUserReassignRolesSnapshot {
    return { id: this.userId, roleIds: [...this.roleIds] };
  }

  public toLoggerPayload(): IUserReassignRolesLoggerPayload {
    const userRoles = this.roleIds.map((roleId) => ({ roleId }));

    return { id: this.userId, userRoles };
  }
}
