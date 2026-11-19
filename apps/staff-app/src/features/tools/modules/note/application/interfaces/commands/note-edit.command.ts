import type { Maybe } from '@acme-libs/toolkit';

export interface INoteEditCommand {
  noteId: string;
  body: string;
  editorId: string;
  expectedVersion: Maybe<number>;
}
