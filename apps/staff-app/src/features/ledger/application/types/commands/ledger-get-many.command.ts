import type { Maybe } from '@acme-libs/toolkit';

export interface ILedgerGetManyCommand {
  page: Maybe<number>;
  limit: Maybe<number>;
  subjectType: Maybe<string>;
  subjectId: Maybe<string>;
  correlationId: Maybe<string>;
}
