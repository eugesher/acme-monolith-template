import { Module } from '@nestjs/common';

import { LedgerListEntriesCase } from '../application';
import { LedgerListEntriesRepository } from '../infrastructure';
import { LedgerController } from './ledger.controller';

@Module({
  controllers: [LedgerController],
  providers: [LedgerListEntriesCase, LedgerListEntriesRepository.PROVIDER],
})
export class LedgerModule {}
