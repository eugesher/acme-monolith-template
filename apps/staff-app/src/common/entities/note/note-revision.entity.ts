import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Note } from './note.entity';

@Entity({ name: 'note_revision' })
@Index('uq_note_revision_version', ['noteId', 'noteVersion'], { unique: true })
export class NoteRevision {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Column({ type: 'bigint', unsigned: true })
  public readonly noteId: string;

  @ManyToOne(() => Note, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id', foreignKeyConstraintName: 'fk_note_revision_note' })
  public readonly note: Note;

  @Column({ type: 'int' })
  public readonly noteVersion: number;

  @Column({ type: 'varchar', length: 100 })
  public readonly titleBefore: string;

  @Column({ type: 'varchar', length: 100 })
  public readonly titleAfter: string;

  @Column({ type: 'text' })
  public readonly bodyBefore: string;

  @Column({ type: 'text' })
  public readonly bodyAfter: string;

  @Column({ type: 'bigint', unsigned: true })
  public readonly editorId: string;

  @Index('idx_note_revision_correlation')
  @Column({ type: 'varchar', length: 64, default: '' })
  public readonly correlationId: string;

  @CreateDateColumn({ type: 'timestamp', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  public readonly recordedAt: Date;
}
