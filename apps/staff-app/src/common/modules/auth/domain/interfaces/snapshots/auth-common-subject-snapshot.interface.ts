import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IAuthCommonSubjectSnapshot {
  readonly id: string;
  readonly email: string;
  readonly roles: readonly string[];
  readonly permissionCodes: readonly PermissionCodeEnum[];
}
