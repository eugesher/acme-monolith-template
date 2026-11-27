import type { StaffRole, StaffRolePermission } from '@acme-staff/common/entities';

export type IRoleGetManyRecord = Pick<StaffRole, 'id' | 'name'> & {
  rolePermissions: Pick<StaffRolePermission, 'code'>[];
};
