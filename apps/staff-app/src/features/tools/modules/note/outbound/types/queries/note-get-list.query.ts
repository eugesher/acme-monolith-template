import type { Maybe } from '@acme-libs/toolkit';

export interface INoteGetListQuery {
  limit: number;
  offset: number;
  subjectType: Maybe<string>;
  subjectId: Maybe<string>;
  resolved: Maybe<boolean>;
  authorId: string;
}
