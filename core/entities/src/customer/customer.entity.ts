import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { UserStatusEnum } from '@acme-libs/kernel';

@Entity({ name: 'customer' })
export class Customer {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Index('uq_customer_email', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  public readonly email: string;

  @Column({ type: 'varchar', length: 255 })
  public readonly passwordHash: string;

  @Column({ type: 'varchar', length: 16, default: UserStatusEnum.ACTIVE })
  public readonly status: UserStatusEnum;

  @CreateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  public readonly createdAt: Date;
}
