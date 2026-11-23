import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleCreateReconstitute {
  id: string;
  name: string;
  permissionCodes: readonly PermissionCodeEnum[];
}
