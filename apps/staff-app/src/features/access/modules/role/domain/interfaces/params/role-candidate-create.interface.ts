import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleCandidateCreate {
  name: string;
  permissionCodes: PermissionCodeEnum[];
}
