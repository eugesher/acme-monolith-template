import { Module } from '@nestjs/common';

import { RoleCreateUseCase, RoleListUseCase, RoleReassignPermissionsUseCase } from '../application';
import {
  RoleCreateRepository,
  RoleListRepository,
  RoleReassignPermissionsRepository,
  RoleTransactionAdapter,
} from '../infrastructure';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [
    RoleListUseCase,
    RoleCreateUseCase,
    RoleReassignPermissionsUseCase,
    RoleListRepository.PROVIDER,
    RoleCreateRepository.PROVIDER,
    RoleReassignPermissionsRepository.PROVIDER,
    RoleTransactionAdapter.PROVIDER,
  ],
})
export class RoleModule {}
