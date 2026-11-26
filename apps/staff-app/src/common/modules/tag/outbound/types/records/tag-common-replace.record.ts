import type { Tag, TagSubject } from '@acme-staff/common/entities';

export type ITagCommonReplaceTagRecord = Pick<Tag, 'id' | 'name'>;

export type ITagCommonReplaceTagSubjectRecord = Pick<TagSubject, 'tagId'>;
