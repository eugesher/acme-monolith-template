import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IAuthCommonSubjectReconstitute {
  id: string;
  email: string;
  userRoles: { role: { name: string; rolePermissions: { code: PermissionCodeEnum }[] } }[];
}
