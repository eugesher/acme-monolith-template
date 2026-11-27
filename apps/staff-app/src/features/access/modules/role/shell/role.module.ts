import { Module } from '@nestjs/common';

import { RoleCreateCase, RoleListCase, RoleReassignPermissionsCase } from '../application';
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
    RoleListCase,
    RoleCreateCase,
    RoleReassignPermissionsCase,
    RoleListRepository.PROVIDER,
    RoleCreateRepository.PROVIDER,
    RoleReassignPermissionsRepository.PROVIDER,
    RoleTransactionAdapter.PROVIDER,
  ],
})
export class RoleModule {}
