import type { Maybe } from '@acme-libs/toolkit';

export interface INoteResolveCommand {
  noteId: string;
  authorId: string;
  expectedVersion: Maybe<number>;
}
