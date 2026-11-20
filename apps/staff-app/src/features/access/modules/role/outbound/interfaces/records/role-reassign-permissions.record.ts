import type { StaffRole, StaffRolePermission } from '@acme-staff/common/entities';

export type IRoleReassignPermissionsRoleRecord = Pick<StaffRole, 'id' | 'name'> & {
  rolePermissions: Pick<StaffRolePermission, 'code'>[];
};
