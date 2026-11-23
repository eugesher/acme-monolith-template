import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleListReconstitute {
  id: string;
  name: string;
  rolePermissions: { code: PermissionCodeEnum }[];
}
