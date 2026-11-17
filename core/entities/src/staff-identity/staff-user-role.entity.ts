import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { StaffRole } from './staff-role.entity';
import { StaffUser } from './staff-user.entity';

@Entity({ name: 'staff_user_roles' })
export class StaffUserRole {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  public readonly userId: string;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  public readonly roleId: string;

  @ManyToOne(() => StaffUser, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_staff_user_roles_user' })
  public readonly user: StaffUser;

  @ManyToOne(() => StaffRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', foreignKeyConstraintName: 'fk_staff_user_roles_role' })
  public readonly role: StaffRole;
}
