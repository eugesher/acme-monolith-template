import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleReassignPermissionsLoggerPayload {
  readonly name: string;
  readonly rolePermissions: { readonly code: PermissionCodeEnum }[];
}
