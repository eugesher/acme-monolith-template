import { Module } from '@nestjs/common';

import { TagCommonModule } from '@acme-staff/common/modules';

import {
  OrderGetManyUseCase,
  OrderGetOneUseCase,
  OrderGetTagsUseCase,
  OrderReplaceTagsUseCase,
} from '../application';
import {
  OrderGetManyRepository,
  OrderGetOneRepository,
  OrderGetTagsRepository,
  OrderReplaceTagsRepository,
  OrderTagCommonAdapter,
  OrderTransactionAdapter,
} from '../infrastructure';
import { OrderController } from './order.controller';

@Module({
  imports: [TagCommonModule],
  controllers: [OrderController],
  providers: [
    OrderGetManyUseCase,
    OrderGetOneUseCase,
    OrderGetTagsUseCase,
    OrderReplaceTagsUseCase,
    OrderGetManyRepository.provider,
    OrderGetOneRepository.provider,
    OrderGetTagsRepository.provider,
    OrderReplaceTagsRepository.provider,
    OrderTagCommonAdapter.provider,
    OrderTransactionAdapter.provider,
  ],
})
export class OrderModule {}
