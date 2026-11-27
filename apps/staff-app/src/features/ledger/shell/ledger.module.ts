import { Module } from '@nestjs/common';

import { LedgerGetManyCase } from '../application';
import { LedgerGetManyRepository } from '../infrastructure';
import { LedgerController } from './ledger.controller';

@Module({
  controllers: [LedgerController],
  providers: [LedgerGetManyCase, LedgerGetManyRepository.PROVIDER],
})
export class LedgerModule {}
