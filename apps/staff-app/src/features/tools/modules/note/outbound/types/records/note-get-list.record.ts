import type { Note } from '@acme-staff/common/entities';

export type INoteGetListRecord = [
  Pick<
    Note,
    | 'id'
    | 'subjectType'
    | 'subjectId'
    | 'title'
    | 'authorId'
    | 'resolved'
    | 'version'
    | 'createdAt'
    | 'updatedAt'
  >[],
  number,
];
