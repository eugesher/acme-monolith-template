import { Module } from '@nestjs/common';

import { AuthCommonModule } from '@acme-staff/common/modules';

import { AuthLoginCase, AuthMeCase } from '../application';
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
    AuthLoginCase,
    AuthMeCase,
    AuthLoginRepository.PROVIDER,
    AuthCredentialsLibAdapter.PROVIDER,
    AuthIdentityCommonAdapter.PROVIDER,
  ],
})
export class AuthModule {}
