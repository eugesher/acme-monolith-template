import { Module } from '@nestjs/common';

import { UserReassignRolesUseCase, UserRegisterUseCase } from './application';
import {
  UserCredentialsLibAdapter,
  UserReassignRolesRepository,
  UserRegisterRepository,
  UserTransactionAdapter,
} from './infrastructure';
import { UserController } from './presentation';

@Module({
  controllers: [UserController],
  providers: [
    UserRegisterUseCase,
    UserReassignRolesUseCase,
    UserReassignRolesRepository.provider,
    UserRegisterRepository.provider,
    UserCredentialsLibAdapter.provider,
    UserTransactionAdapter.provider,
  ],
})
export class UserModule {}
