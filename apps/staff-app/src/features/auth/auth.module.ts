import { Module } from '@nestjs/common';

import { CredentialsLibModule } from '@acme-libs/credentials';
import { AuthAudienceEnum } from '@acme-libs/kernel';
import { AuthCommonModule } from '@acme-staff/common/modules';

import { AuthLoginUseCase, AuthMeUseCase } from './application';
import {
  AuthCredentialsLibAdapter,
  AuthIdentityCommonAdapter,
  AuthLoginRepository,
} from './infrastructure';
import { AuthController } from './presentation';

@Module({
  imports: [CredentialsLibModule.register(AuthAudienceEnum.STAFF), AuthCommonModule],
  controllers: [AuthController],
  providers: [
    AuthLoginUseCase,
    AuthMeUseCase,
    AuthLoginRepository.provider,
    AuthCredentialsLibAdapter.provider,
    AuthIdentityCommonAdapter.provider,
  ],
})
export class AuthModule {}
