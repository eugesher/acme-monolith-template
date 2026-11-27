import { Module } from '@nestjs/common';

import { TagCommonModule } from '@acme-staff/common/modules';

import {
  OrderGetManyCase,
  OrderGetOneCase,
  OrderGetTagsCase,
  OrderReplaceTagsCase,
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
    OrderGetManyCase,
    OrderGetOneCase,
    OrderGetTagsCase,
    OrderReplaceTagsCase,
    OrderGetManyRepository.PROVIDER,
    OrderGetOneRepository.PROVIDER,
    OrderGetTagsRepository.PROVIDER,
    OrderReplaceTagsRepository.PROVIDER,
    OrderTagCommonAdapter.PROVIDER,
    OrderTransactionAdapter.PROVIDER,
  ],
})
export class OrderModule {}
