import { Module } from '@nestjs/common';

import { AuthCommonModule } from '@acme-staff/common/modules';

import { AuthLoginUseCase, AuthMeUseCase } from '../application';
import {
  AuthCredentialsLibAdapter,
  AuthIdentityCommonAdapter,
  AuthLoginRepository,
} from '../infrastructure';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthCommonModule],
  controllers: [AuthController],
  providers: [
    AuthLoginUseCase,
    AuthMeUseCase,
    AuthLoginRepository.PROVIDER,
    AuthCredentialsLibAdapter.PROVIDER,
    AuthIdentityCommonAdapter.PROVIDER,
  ],
})
export class AuthModule {}
