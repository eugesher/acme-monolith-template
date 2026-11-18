import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  LEDGER_LIST_ENTRIES_REPOSITORY_PORT,
  type ILedgerListEntriesQuery,
  type ILedgerListEntriesRecord,
  type ILedgerListEntriesRepositoryPort,
} from '../../../outbound';
import { LedgerPersistenceHost } from '../host/ledger-persistence.host';

@Injectable()
export class LedgerListEntriesRepository
  extends LedgerPersistenceHost
  implements ILedgerListEntriesRepositoryPort
{
  public static readonly provider: ClassProvider<ILedgerListEntriesRepositoryPort> = {
    provide: LEDGER_LIST_ENTRIES_REPOSITORY_PORT,
    useClass: LedgerListEntriesRepository,
  };

  public async list(query: ILedgerListEntriesQuery): Promise<ILedgerListEntriesRecord> {
    return await this.createLedgerEntryBuilder().forList(query).getManyAndCount();
  }
}
