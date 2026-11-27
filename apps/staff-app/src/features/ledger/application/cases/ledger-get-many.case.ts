import { Inject, Injectable } from '@nestjs/common';

import { PaginationHelper } from '@acme-libs/toolkit';

import { LedgerGetManyModel } from '../../domain';
import {
  LEDGER_LIST_ENTRIES_REPOSITORY_PORT,
  type ILedgerGetManyRepositoryPort,
} from '../../outbound';
import type { ILedgerGetManyCommand, ILedgerGetManyView } from '../types';

@Injectable()
export class LedgerGetManyCase {
  constructor(
    @Inject(LEDGER_LIST_ENTRIES_REPOSITORY_PORT)
    private readonly repository: ILedgerGetManyRepositoryPort,
  ) {}

  public async execute(command: ILedgerGetManyCommand): Promise<ILedgerGetManyView> {
    const { subjectType, subjectId, correlationId } = command;
    const { limit, offset, page } = PaginationHelper.clampPageWindow({ query: command });
    const [records, total] = await this.repository.list({
      limit,
      offset,
      subjectType,
      subjectId,
      correlationId,
    });
    const data = LedgerGetManyModel.toViewData(records);

    return PaginationHelper.toPage({ data, page, limit, total });
  }
}
