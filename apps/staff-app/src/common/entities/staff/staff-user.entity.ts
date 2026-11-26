import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserStatusEnum } from '@acme-libs/kernel';

import { StaffUserRole } from './staff-user-role.entity';

@Entity({ name: 'staff_user' })
export class StaffUser {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Index('uq_staff_user_email', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  public readonly email: string;

  @Column({ type: 'varchar', length: 255 })
  public readonly passwordHash: string;

  @Column({ type: 'varchar', length: 16, default: UserStatusEnum.ACTIVE })
  public readonly status: UserStatusEnum;

  @CreateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  public readonly createdAt: Date;

  @OneToMany(() => StaffUserRole, (userRole) => userRole.user)
  public readonly userRoles: StaffUserRole[];
}
