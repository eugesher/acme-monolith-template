import type { PermissionCodeEnum } from '@acme-libs/kernel';

import type {
  IStaffAuthCommonSubjectReconstitute,
  IStaffAuthCommonSubjectSnapshot,
} from '../interfaces';

export class StaffAuthCommonSubjectModel {
  private constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly roles: readonly string[],
    private readonly permissionCodes: readonly PermissionCodeEnum[],
  ) {}

  public static reconstitute(
    record: IStaffAuthCommonSubjectReconstitute,
  ): StaffAuthCommonSubjectModel {
    const { id, email, userRoles } = record;
    const roles = userRoles.map((userRole) => userRole.role.name).sort();
    const codes = userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map((rolePermission) => rolePermission.code),
    );
    const permissionCodes = [...new Set(codes)].sort();

    return new StaffAuthCommonSubjectModel(id, email, roles, permissionCodes);
  }

  public toSnapshot(): IStaffAuthCommonSubjectSnapshot {
    return {
      id: this.id,
      email: this.email,
      roles: this.roles,
      permissionCodes: this.permissionCodes,
    };
  }
}
