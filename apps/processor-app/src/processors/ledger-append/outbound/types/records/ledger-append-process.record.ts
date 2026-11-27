import type { LedgerEntry } from '@acme-core/entities';

import type { LedgerAppendProcessEntryInsertOutcomeEnum } from '../enums/ledger-append-process-entry-insert-outcome.enum';

export type ILedgerAppendProcessEntryRecord = Pick<LedgerEntry, 'id'>;

export type ILedgerAppendProcessEntryInsertRecord =
  | (Pick<LedgerEntry, 'id'> & { outcome: LedgerAppendProcessEntryInsertOutcomeEnum.INSERTED })
  | { outcome: LedgerAppendProcessEntryInsertOutcomeEnum.DUPLICATE };
