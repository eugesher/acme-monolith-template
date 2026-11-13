import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleCandidate {
  name: string;
  permissionCodes: PermissionCodeEnum[];
}
