import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { ReminderStatusEnum } from '@acme-libs/kernel';

@Entity({ name: 'reminder' })
@Index('idx_reminder_owner_status', ['ownerId', 'status'])
export class Reminder {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Column({ type: 'bigint', unsigned: true })
  public readonly ownerId: string;

  @Column({ type: 'varchar', length: 255 })
  public readonly title: string;

  @Column({ type: 'varchar', length: 2000, default: '' })
  public readonly body: string;

  @Index('idx_reminder_due')
  @Column({ type: 'date' })
  public readonly dueOn: string;

  @Column({ type: 'enum', enum: ReminderStatusEnum, default: ReminderStatusEnum.PENDING })
  public readonly status: ReminderStatusEnum;

  @VersionColumn({ default: 1 })
  public readonly version: number;

  @CreateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  public readonly createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  public readonly deletedAt: Date | null;
}
