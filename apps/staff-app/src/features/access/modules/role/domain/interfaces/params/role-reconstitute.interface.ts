import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleReconstitute {
  id: string;
  name: string;
  rolePermissions: { code: PermissionCodeEnum }[];
}
