import type { StaffRolePermission } from '@acme-staff/common/entities';

export type IRoleReassignPermissionsRolePermissionInsertQuery = Pick<
  StaffRolePermission,
  'roleId' | 'code'
>;
