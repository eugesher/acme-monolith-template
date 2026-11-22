import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IAuthGlobalValidateSubjectView {
  id: string;
  email: string;
  permissionCodes: readonly PermissionCodeEnum[];
}
