import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ledger_entry' })
@Index('idx_ledger_subject', ['subjectType', 'subjectId'])
export class LedgerEntry {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Index('uq_ledger_operation_key', { unique: true })
  @Column({ type: 'varchar', length: 128 })
  public readonly operationKey: string;

  @Column({ type: 'varchar', length: 64 })
  public readonly subjectType: string;

  @Column({ type: 'varchar', length: 64 })
  public readonly subjectId: string;

  @Column({ type: 'varchar', length: 64 })
  public readonly action: string;

  @Column({ type: 'json' })
  public readonly payload: Record<string, unknown>;

  @Index('idx_ledger_correlation')
  @Column({ type: 'varchar', length: 64, default: '' })
  public readonly correlationId: string;

  @Column({ type: 'timestamp', precision: 3 })
  public readonly occurredAt: Date;

  @CreateDateColumn({ type: 'timestamp', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  public readonly recordedAt: Date;
}
