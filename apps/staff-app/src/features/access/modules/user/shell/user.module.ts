import { Module } from '@nestjs/common';

import { UserReassignRolesUseCase, UserRegisterUseCase } from '../application';
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
    UserRegisterUseCase,
    UserReassignRolesUseCase,
    UserReassignRolesRepository.PROVIDER,
    UserRegisterRepository.PROVIDER,
    UserCredentialsLibAdapter.PROVIDER,
    UserTransactionAdapter.PROVIDER,
  ],
})
export class UserModule {}
