import { Module } from '@nestjs/common';

import { CredentialsLibModule } from '@acme-libs/credentials';
import { HttpExceptionFilter } from '@acme-libs/http';
import { AuthAudienceEnum } from '@acme-libs/kernel';
import { StaffAuthCoreModule } from '@acme-core/modules/staff-auth';

import { AuthLoginUseCase, AuthMeUseCase } from './application';
import {
  AuthCredentialsLibAdapter,
  AuthIdentityCoreAdapter,
  AuthLoginRepository,
} from './infrastructure';
import { AuthController } from './presentation';

@Module({
  imports: [CredentialsLibModule.register(AuthAudienceEnum.STAFF), StaffAuthCoreModule],
  controllers: [AuthController],
  providers: [
    HttpExceptionFilter,
    AuthLoginUseCase,
    AuthMeUseCase,
    AuthLoginRepository.provider,
    AuthCredentialsLibAdapter.provider,
    AuthIdentityCoreAdapter.provider,
  ],
})
export class AuthModule {}
