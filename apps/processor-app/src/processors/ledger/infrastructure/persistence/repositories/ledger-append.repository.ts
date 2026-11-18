import { Injectable, type ClassProvider } from '@nestjs/common';
import type { QueryDeepPartialEntity } from 'typeorm';

import { MysqlErrorHelper } from '@acme-libs/toolkit';
import type { LedgerEntry } from '@acme-core/entities';

import {
  LEDGER_APPEND_REPOSITORY_PORT,
  LedgerAppendEntryInsertOutcomeEnum,
  type ILedgerAppendEntryInsertQuery,
  type ILedgerAppendEntryInsertRecord,
  type ILedgerAppendEntryRecord,
  type ILedgerAppendRepositoryPort,
} from '../../../outbound';
import { LedgerPersistenceHost } from '../host/ledger-persistence.host';

@Injectable()
export class LedgerAppendRepository
  extends LedgerPersistenceHost
  implements ILedgerAppendRepositoryPort
{
  public static readonly provider: ClassProvider<ILedgerAppendRepositoryPort> = {
    provide: LEDGER_APPEND_REPOSITORY_PORT,
    useClass: LedgerAppendRepository,
  };

  public async insert(
    record: ILedgerAppendEntryInsertQuery,
  ): Promise<ILedgerAppendEntryInsertRecord> {
    const payload = record.payload as QueryDeepPartialEntity<LedgerEntry>['payload'];
    const entryId = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.ledgerEntryRepository.insertOne({ ...record, payload }),
    );

    if (entryId === null) {
      return { outcome: LedgerAppendEntryInsertOutcomeEnum.DUPLICATE };
    }

    return { outcome: LedgerAppendEntryInsertOutcomeEnum.INSERTED, id: entryId };
  }

  public async findByOperationKey(operationKey: string): Promise<ILedgerAppendEntryRecord> {
    return await this.createLedgerEntryBuilder().forByOperationKey(operationKey).getOneOrFail();
  }
}
