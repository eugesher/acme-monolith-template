import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleReassignPermissionsReconstitute {
  id: string;
  name: string;
  rolePermissions: { code: PermissionCodeEnum }[];
}
