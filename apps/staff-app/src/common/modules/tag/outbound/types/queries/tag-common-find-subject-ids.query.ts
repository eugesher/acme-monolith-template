import type { TagSubject } from '@acme-staff/common/entities';

export type ITagCommonFindSubjectIdsQuery = Pick<TagSubject, 'subjectType' | 'tagId'>;
