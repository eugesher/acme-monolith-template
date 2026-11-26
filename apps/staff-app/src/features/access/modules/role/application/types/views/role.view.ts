import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IRoleView {
  readonly id: string;
  readonly name: string;
  readonly permissionCodes: readonly PermissionCodeEnum[];
}
