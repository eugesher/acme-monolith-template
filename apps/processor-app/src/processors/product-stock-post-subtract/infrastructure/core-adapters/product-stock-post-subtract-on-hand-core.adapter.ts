import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import {
  PRODUCT_STOCK_CORE_PORT,
  type IProductStockCorePort,
} from '@acme-core/contracts/product-stock';

import {
  PRODUCT_STOCK_POST_SUBTRACT_ON_HAND_PORT,
  type IProductStockPostSubtractOnHandLockCommand,
  type IProductStockPostSubtractOnHandPort,
  type IProductStockPostSubtractOnHandView,
} from '../../outbound';

@Injectable()
export class ProductStockPostSubtractOnHandCoreAdapter implements IProductStockPostSubtractOnHandPort {
  public static readonly PROVIDER: ClassProvider<IProductStockPostSubtractOnHandPort> = {
    provide: PRODUCT_STOCK_POST_SUBTRACT_ON_HAND_PORT,
    useClass: ProductStockPostSubtractOnHandCoreAdapter,
  };

  constructor(
    @Inject(PRODUCT_STOCK_CORE_PORT)
    private readonly productStock: IProductStockCorePort,
  ) {}

  public async lock(
    command: IProductStockPostSubtractOnHandLockCommand,
  ): Promise<IProductStockPostSubtractOnHandView[]> {
    const { productIds } = command;

    return await this.productStock.lock({ productIds });
  }
}
