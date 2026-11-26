import type { TagSubject } from '@acme-staff/common/entities';

export type ITagCommonFindBySubjectQuery = Pick<TagSubject, 'subjectType' | 'subjectId'>;
