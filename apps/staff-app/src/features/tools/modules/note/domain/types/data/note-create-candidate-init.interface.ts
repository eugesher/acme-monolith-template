import type { Maybe } from '@acme-libs/toolkit';

export interface INoteCreateCandidateInit {
  subjectType: string;
  subjectId: string;
  title: Maybe<string>;
  body: string;
  authorId: string;
}
