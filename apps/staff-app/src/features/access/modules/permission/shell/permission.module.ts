import { Module } from '@nestjs/common';

import { PermissionListCase } from '../application';
import { PermissionController } from './permission.controller';

@Module({
  controllers: [PermissionController],
  providers: [PermissionListCase],
})
export class PermissionModule {}
