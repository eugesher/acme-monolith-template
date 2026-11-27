import { Module } from '@nestjs/common';

import { UserReassignRolesCase, UserRegisterCase } from '../application';
import {
  UserCredentialsLibAdapter,
  UserReassignRolesRepository,
  UserRegisterRepository,
  UserTransactionAdapter,
} from '../infrastructure';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [
    UserRegisterCase,
    UserReassignRolesCase,
    UserReassignRolesRepository.PROVIDER,
    UserRegisterRepository.PROVIDER,
    UserCredentialsLibAdapter.PROVIDER,
    UserTransactionAdapter.PROVIDER,
  ],
})
export class UserModule {}
