import type { StaffRole, StaffRolePermission, StaffUser } from '@acme-staff/common/entities';

export type IStaffAuthCommonFindSubjectStaffUserRecord = Pick<StaffUser, 'id' | 'email'> & {
  userRoles: {
    role: Pick<StaffRole, 'name'> & {
      rolePermissions: Pick<StaffRolePermission, 'code'>[];
    };
  }[];
};
