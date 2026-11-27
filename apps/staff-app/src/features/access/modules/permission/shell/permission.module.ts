import { Module } from '@nestjs/common';

import { PermissionGetManyCase } from '../application';
import { PermissionController } from './permission.controller';

@Module({
  controllers: [PermissionController],
  providers: [PermissionGetManyCase],
})
export class PermissionModule {}
