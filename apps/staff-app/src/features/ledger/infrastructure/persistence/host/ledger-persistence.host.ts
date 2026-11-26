import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { LedgerEntry } from '@acme-core/entities';

import { LedgerPersistenceLedgerEntryBuilder } from '../builders/ledger-persistence-ledger-entry.builder';

export abstract class LedgerPersistenceHost {
  protected get ledgerEntryRepository(): IHostedRepository<LedgerEntry> {
    return this.orm.getRepository(LedgerEntry);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createLedgerEntryBuilder(): LedgerPersistenceLedgerEntryBuilder {
    return new LedgerPersistenceLedgerEntryBuilder(
      this.ledgerEntryRepository.createQueryBuilder(LedgerEntry.name),
    );
  }
}
