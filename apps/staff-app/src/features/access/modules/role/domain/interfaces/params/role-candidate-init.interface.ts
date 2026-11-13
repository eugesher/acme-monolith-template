import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleCandidateInit {
  name: string;
  permissionCodes: PermissionCodeEnum[];
}
