import { Module } from '@nestjs/common';

import { LedgerCoreModule } from '@acme-core/modules/ledger';

import { AuthLoginCase, AuthRegisterCase } from '../application';
import {
  AuthCredentialsLibAdapter,
  AuthLedgerCoreAdapter,
  AuthLoginRepository,
  AuthRegisterRepository,
} from '../infrastructure';
import { AuthController } from './auth.controller';

@Module({
  imports: [LedgerCoreModule],
  controllers: [AuthController],
  providers: [
    AuthLoginCase,
    AuthRegisterCase,
    AuthLoginRepository.PROVIDER,
    AuthRegisterRepository.PROVIDER,
    AuthCredentialsLibAdapter.PROVIDER,
    AuthLedgerCoreAdapter.PROVIDER,
  ],
})
export class AuthModule {}
