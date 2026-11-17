import type { PermissionCodeEnum } from '@acme-libs/kernel';

export interface IStaffAuthCoreSubjectReconstitute {
  id: string;
  email: string;
  userRoles: { role: { name: string; rolePermissions: { code: PermissionCodeEnum }[] } }[];
}
