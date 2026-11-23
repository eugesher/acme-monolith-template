import { Module } from '@nestjs/common';

import { LedgerListEntriesUseCase } from '../application';
import { LedgerListEntriesRepository } from '../infrastructure';
import { LedgerController } from './ledger.controller';

@Module({
  controllers: [LedgerController],
  providers: [LedgerListEntriesUseCase, LedgerListEntriesRepository.PROVIDER],
})
export class LedgerModule {}
