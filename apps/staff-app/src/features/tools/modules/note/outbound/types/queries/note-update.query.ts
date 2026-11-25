import type { Note, NoteRevision } from '@acme-staff/common/entities';

export interface INoteUpdateQuery extends Pick<Note, 'id' | 'body' | 'resolved' | 'version'> {
  versionAsRead: number;
}

export type INoteUpdateAppendRevisionQuery = Pick<
  NoteRevision,
  'noteId' | 'noteVersion' | 'bodyBefore' | 'bodyAfter' | 'editorId' | 'correlationId'
>;
