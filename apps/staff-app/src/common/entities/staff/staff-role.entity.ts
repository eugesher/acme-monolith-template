import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StaffRolePermission } from './staff-role-permission.entity';

@Entity({ name: 'staff_role' })
export class StaffRole {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Index('uq_staff_role_name', { unique: true })
  @Column({ type: 'varchar', length: 64 })
  public readonly name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public readonly description: string | null;

  @OneToMany(() => StaffRolePermission, (rolePermission) => rolePermission.role)
  public readonly rolePermissions: StaffRolePermission[];
}
