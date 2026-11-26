import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { IdempotencyStatusEnum } from '@acme-libs/kernel';

@Entity({ name: 'idempotency_key' })
@Index('uq_idempotency_scope_key', ['scope', 'idempotencyKey'], { unique: true })
export class IdempotencyKey {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Column({ type: 'varchar', length: 64 })
  public readonly scope: string;

  @Column({ type: 'varchar', length: 128 })
  public readonly idempotencyKey: string;

  @Column({ type: 'char', length: 64 })
  public readonly requestFingerprint: string;

  @Column({ type: 'varchar', length: 16, default: IdempotencyStatusEnum.IN_FLIGHT })
  public readonly status: IdempotencyStatusEnum;

  @Column({ type: 'text', nullable: true })
  public readonly responseBody: string | null;

  @Index('idx_idempotency_created_at')
  @CreateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  public readonly createdAt: Date;
}
