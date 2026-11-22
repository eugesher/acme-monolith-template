import { Module } from '@nestjs/common';

import { LedgerCoreModule } from '@acme-core/modules/ledger';

import { AuthLoginUseCase, AuthRegisterUseCase } from '../application';
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
    AuthLoginUseCase,
    AuthRegisterUseCase,
    AuthLoginRepository.provider,
    AuthRegisterRepository.provider,
    AuthCredentialsLibAdapter.provider,
    AuthLedgerCoreAdapter.provider,
  ],
})
export class AuthModule {}
