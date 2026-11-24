import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { PermissionCodeEnum } from '@acme-libs/kernel';

import { StaffRole } from './staff-role.entity';

@Entity({ name: 'staff_role_permissions' })
export class StaffRolePermission {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  public readonly roleId: string;

  @PrimaryColumn({ type: 'varchar', length: 64 })
  public readonly code: PermissionCodeEnum;

  @ManyToOne(() => StaffRole, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', foreignKeyConstraintName: 'fk_staff_role_permissions_role' })
  public readonly role: StaffRole;
}
