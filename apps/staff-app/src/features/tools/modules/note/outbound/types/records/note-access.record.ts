import type { Note } from '@acme-staff/common/entities';

export type INoteAccessRecord = Pick<
  Note,
  | 'id'
  | 'subjectType'
  | 'subjectId'
  | 'title'
  | 'body'
  | 'authorId'
  | 'resolved'
  | 'version'
  | 'createdAt'
  | 'updatedAt'
>;
