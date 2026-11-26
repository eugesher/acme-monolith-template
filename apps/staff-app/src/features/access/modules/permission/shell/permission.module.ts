import { Module } from '@nestjs/common';

import { PermissionListUseCase } from '../application';
import { PermissionController } from './permission.controller';

@Module({
  controllers: [PermissionController],
  providers: [PermissionListUseCase],
})
export class PermissionModule {}
