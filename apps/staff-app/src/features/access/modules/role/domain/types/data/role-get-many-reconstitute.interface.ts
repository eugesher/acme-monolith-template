import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleGetManyReconstitute {
  id: string;
  name: string;
  rolePermissions: { code: PermissionCodeEnum }[];
}
