import type { StaffRole, StaffRolePermission } from '@acme-staff/common/entities';

export type IRoleListRecord = Pick<StaffRole, 'id' | 'name'> & {
  rolePermissions: Pick<StaffRolePermission, 'code'>[];
};
