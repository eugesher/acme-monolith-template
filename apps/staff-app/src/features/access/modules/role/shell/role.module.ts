import { Module } from '@nestjs/common';

import { RoleCreateCase, RoleGetManyCase, RoleReassignPermissionsCase } from '../application';
import {
  RoleCreateRepository,
  RoleGetManyRepository,
  RoleReassignPermissionsRepository,
  RoleTransactionAdapter,
} from '../infrastructure';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [
    RoleGetManyCase,
    RoleCreateCase,
    RoleReassignPermissionsCase,
    RoleGetManyRepository.PROVIDER,
    RoleCreateRepository.PROVIDER,
    RoleReassignPermissionsRepository.PROVIDER,
    RoleTransactionAdapter.PROVIDER,
  ],
})
export class RoleModule {}
