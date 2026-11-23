import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleReassignPermissionsRolePermission {
  readonly roleId: string;
  readonly code: PermissionCodeEnum;
}
