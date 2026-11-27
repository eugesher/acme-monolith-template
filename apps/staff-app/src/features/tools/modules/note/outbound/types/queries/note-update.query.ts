import type { Note, NoteRevision } from '@acme-staff/common/entities';

export interface INoteUpdateQuery extends Pick<
  Note,
  'id' | 'title' | 'body' | 'resolved' | 'version'
> {
  versionAsRead: number;
}

export type INoteUpdateAppendRevisionQuery = Pick<
  NoteRevision,
  | 'noteId'
  | 'noteVersion'
  | 'titleBefore'
  | 'titleAfter'
  | 'bodyBefore'
  | 'bodyAfter'
  | 'editorId'
  | 'correlationId'
>;
