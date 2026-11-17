import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleRolePermission {
  readonly roleId: string;
  readonly code: PermissionCodeEnum;
}
