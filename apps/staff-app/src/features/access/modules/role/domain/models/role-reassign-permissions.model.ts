import type { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleAggregate } from '../aggregates/role.aggregate';
import type {
  IRoleReassignPermissionsLoggerPayload,
  IRoleReassignPermissionsReconstitute,
  IRoleReassignPermissionsRolePermission,
} from '../types';

export class RoleReassignPermissionsModel extends RoleAggregate {
  public static reconstitute(
    record: IRoleReassignPermissionsReconstitute,
  ): RoleReassignPermissionsModel {
    const { id, name, rolePermissions } = record;
    const permissionCodes = rolePermissions.map((rolePermission) => rolePermission.code).sort();

    return new RoleReassignPermissionsModel(id, name, permissionCodes);
  }

  public reassignPermissions(requested: PermissionCodeEnum[]): void {
    this.permissionCodes = [...new Set(requested)];
  }

  public getRolePermissions(): IRoleReassignPermissionsRolePermission[] {
    return this.permissionCodes.map((code) => ({ roleId: this.id, code }));
  }

  public toLoggerPayload(): IRoleReassignPermissionsLoggerPayload {
    const rolePermissions = this.permissionCodes.map((code) => ({ code }));

    return { name: this.name, rolePermissions };
  }
}
