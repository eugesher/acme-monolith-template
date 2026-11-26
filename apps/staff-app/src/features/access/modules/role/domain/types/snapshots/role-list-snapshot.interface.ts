import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleListSnapshot {
  readonly id: string;
  readonly name: string;
  readonly permissionCodes: readonly PermissionCodeEnum[];
}
