import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleSnapshot {
  id: string;
  name: string;
  permissionCodes: PermissionCodeEnum[];
}
