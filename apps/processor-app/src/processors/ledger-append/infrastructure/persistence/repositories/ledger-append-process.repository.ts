import { Injectable, type ClassProvider } from '@nestjs/common';
import type { QueryDeepPartialEntity } from 'typeorm';

import { MysqlErrorHelper } from '@acme-libs/toolkit';
import type { LedgerEntry } from '@acme-core/entities';

import {
  LEDGER_APPEND_PROCESS_REPOSITORY_PORT,
  LedgerAppendProcessEntryInsertOutcomeEnum,
  type ILedgerAppendProcessEntryInsertQuery,
  type ILedgerAppendProcessEntryInsertRecord,
  type ILedgerAppendProcessEntryRecord,
  type ILedgerAppendProcessRepositoryPort,
} from '../../../outbound';
import { LedgerAppendPersistenceHost } from '../host/ledger-append-persistence.host';

@Injectable()
export class LedgerAppendProcessRepository
  extends LedgerAppendPersistenceHost
  implements ILedgerAppendProcessRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<ILedgerAppendProcessRepositoryPort> = {
    provide: LEDGER_APPEND_PROCESS_REPOSITORY_PORT,
    useClass: LedgerAppendProcessRepository,
  };

  public async insert(
    record: ILedgerAppendProcessEntryInsertQuery,
  ): Promise<ILedgerAppendProcessEntryInsertRecord> {
    const payload = record.payload as QueryDeepPartialEntity<LedgerEntry>['payload'];
    const entryId = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.ledgerEntryRepository.insertOne({ ...record, payload }),
    );

    if (entryId === null) {
      return { outcome: LedgerAppendProcessEntryInsertOutcomeEnum.DUPLICATE };
    }

    return { outcome: LedgerAppendProcessEntryInsertOutcomeEnum.INSERTED, id: entryId };
  }

  public async findByOperationKey(operationKey: string): Promise<ILedgerAppendProcessEntryRecord> {
    return await this.createLedgerEntryBuilder().forOperationKey(operationKey).getOneOrFail();
  }
}
