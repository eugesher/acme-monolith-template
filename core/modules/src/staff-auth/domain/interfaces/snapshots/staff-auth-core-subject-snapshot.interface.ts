import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IStaffAuthCoreSubjectSnapshot {
  readonly id: string;
  readonly email: string;
  readonly roles: string[];
  readonly permissionCodes: PermissionCodeEnum[];
}
