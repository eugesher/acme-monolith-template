import type { Maybe } from '@acme-libs/toolkit';

export interface INoteUpdateCommand {
  noteId: string;
  body: string;
  editorId: string;
  expectedVersion: Maybe<number>;
}
