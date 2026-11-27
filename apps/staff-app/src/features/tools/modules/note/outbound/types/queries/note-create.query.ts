import type { Note } from '@acme-staff/common/entities';

export type INoteCreateInsertQuery = Pick<
  Note,
  'subjectType' | 'subjectId' | 'title' | 'body' | 'authorId' | 'resolved' | 'version'
>;
