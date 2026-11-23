import type { Maybe } from '@acme-libs/toolkit';

export interface INoteWriteCommand {
  noteId: string;
  authorId: string;
  expectedVersion: Maybe<number>;
}
