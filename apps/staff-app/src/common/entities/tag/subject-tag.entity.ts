import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Tag } from './tag.entity';

@Entity({ name: 'subject_tag' })
@Index('uq_subject_tag_subject_tag', ['subjectType', 'subjectId', 'tagId'], { unique: true })
@Index('idx_subject_tag_tag', ['tagId', 'subjectType', 'subjectId'])
export class SubjectTag {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: string;

  @Column({ type: 'varchar', length: 32 })
  public readonly subjectType: string;

  @Column({ type: 'bigint', unsigned: true })
  public readonly subjectId: string;

  @Column({ type: 'bigint', unsigned: true })
  public readonly tagId: string;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id', foreignKeyConstraintName: 'fk_subject_tag_tag' })
  public readonly tag: Tag;

  @CreateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  public readonly createdAt: Date;
}
