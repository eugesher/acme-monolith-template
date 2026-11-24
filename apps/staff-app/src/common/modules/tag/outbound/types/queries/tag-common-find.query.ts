import type { TagSubject } from '@acme-staff/common/entities';

export type ITagCommonFindQuery = Pick<TagSubject, 'subjectType' | 'subjectId'>;
