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
    RoleListRepository.provider,
    RoleCreateRepository.provider,
    RoleReassignPermissionsRepository.provider,
    RoleTransactionAdapter.provider,
  ],
})
export class RoleModule {}
