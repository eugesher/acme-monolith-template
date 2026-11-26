import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { LedgerEntry } from '@acme-core/entities';

import { LedgerAppendPersistenceLedgerEntryBuilder } from '../builders/ledger-append-persistence-ledger-entry.builder';

export abstract class LedgerAppendPersistenceHost {
  protected get ledgerEntryRepository(): IHostedRepository<LedgerEntry> {
    return this.orm.getRepository(LedgerEntry);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createLedgerEntryBuilder(): LedgerAppendPersistenceLedgerEntryBuilder {
    return new LedgerAppendPersistenceLedgerEntryBuilder(
      this.ledgerEntryRepository.createQueryBuilder(LedgerEntry.name),
    );
  }
}
