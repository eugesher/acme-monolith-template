import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IStaffAuthCommonSubjectReconstitute {
  id: string;
  email: string;
  userRoles: { role: { name: string; rolePermissions: { code: PermissionCodeEnum }[] } }[];
}
