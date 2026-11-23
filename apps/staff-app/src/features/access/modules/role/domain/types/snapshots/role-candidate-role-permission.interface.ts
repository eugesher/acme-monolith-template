import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleCandidateRolePermission {
  readonly roleId: string;
  readonly code: PermissionCodeEnum;
}
