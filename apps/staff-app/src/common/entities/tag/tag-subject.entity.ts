import { CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Tag } from './tag.entity';

@Entity({ name: 'tag_subject' })
@Index('idx_tag_subject_subject', ['subjectType', 'subjectId'])
export class TagSubject {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  public readonly tagId: string;

  @PrimaryColumn({ type: 'varchar', length: 32 })
  public readonly subjectType: string;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  public readonly subjectId: string;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id', foreignKeyConstraintName: 'fk_tag_subject_tag' })
  public readonly tag: Tag;

  @CreateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  public readonly createdAt: Date;
}
