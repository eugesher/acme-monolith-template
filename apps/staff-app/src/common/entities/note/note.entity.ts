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

@Entity({ name: 'note' })
@Index('idx_note_subject', ['subjectType', 'subjectId'])
export class Note {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Column({ type: 'varchar', length: 64 })
  public readonly subjectType: string;

  @Column({ type: 'varchar', length: 64 })
  public readonly subjectId: string;

  @Column({ type: 'varchar', length: 100 })
  public readonly title: string;

  @Column({ type: 'text' })
  public readonly body: string;

  @Index('idx_note_author')
  @Column({ type: 'bigint', unsigned: true })
  public readonly authorId: string;

  @Column({ type: 'boolean', default: false })
  public readonly resolved: boolean;

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
