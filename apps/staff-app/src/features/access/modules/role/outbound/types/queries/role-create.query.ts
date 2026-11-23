import type { StaffRole, StaffRolePermission } from '@acme-staff/common/entities';

export type IRoleCreateStaffRoleInsertQuery = Pick<StaffRole, 'name'>;

export type IRoleCreateRolePermissionInsertQuery = Pick<StaffRolePermission, 'roleId' | 'code'>;
