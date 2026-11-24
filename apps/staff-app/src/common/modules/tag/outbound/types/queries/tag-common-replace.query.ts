import type { TagSubject } from '@acme-staff/common/entities';

export type ITagCommonReplaceFindLinkedQuery = Pick<TagSubject, 'subjectType' | 'subjectId'>;

export type ITagCommonReplaceLinkQuery = Pick<TagSubject, 'subjectType' | 'subjectId'> & {
  tagIds: string[];
};

export type ITagCommonReplaceUnlinkQuery = Pick<TagSubject, 'subjectType' | 'subjectId'> & {
  tagIds: string[];
};
