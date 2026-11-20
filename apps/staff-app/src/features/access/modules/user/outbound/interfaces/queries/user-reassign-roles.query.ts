import type { StaffUserRole } from '@acme-staff/common/entities';

export interface IUserReassignRolesStaffUserRoleDeleteQuery extends Pick<StaffUserRole, 'userId'> {
  roleIds: readonly string[];
}

export type IUserReassignRolesStaffUserRoleInsertQuery = Pick<StaffUserRole, 'userId' | 'roleId'>;
