import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  LEDGER_LIST_ENTRIES_REPOSITORY_PORT,
  type ILedgerGetManyListQuery,
  type ILedgerGetManyRecord,
  type ILedgerGetManyRepositoryPort,
} from '../../../outbound';
import { LedgerPersistenceHost } from '../host/ledger-persistence.host';

@Injectable()
export class LedgerGetManyRepository
  extends LedgerPersistenceHost
  implements ILedgerGetManyRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<ILedgerGetManyRepositoryPort> = {
    provide: LEDGER_LIST_ENTRIES_REPOSITORY_PORT,
    useClass: LedgerGetManyRepository,
  };

  public async list(query: ILedgerGetManyListQuery): Promise<ILedgerGetManyRecord> {
    return await this.createLedgerEntryBuilder().forList(query).getManyAndCount();
  }
}
