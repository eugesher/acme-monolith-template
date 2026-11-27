import type { NoteRevision } from '@acme-staff/common/entities';

export type INoteGetRevisionsRecord = [
  Pick<
    NoteRevision,
    | 'id'
    | 'noteId'
    | 'noteVersion'
    | 'titleBefore'
    | 'titleAfter'
    | 'bodyBefore'
    | 'bodyAfter'
    | 'editorId'
    | 'correlationId'
    | 'recordedAt'
  >[],
  number,
];
