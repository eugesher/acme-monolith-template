import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { TRANSACTION_PORT, type ITransactionPort } from '@acme-libs/contracts/local-storage';

import {
  PRODUCT_STOCK_POST_SUBTRACT_TRANSACTION_PORT,
  type IProductStockPostSubtractTransactionPort,
} from '../../../outbound';

@Injectable()
export class ProductStockPostSubtractTransactionAdapter implements IProductStockPostSubtractTransactionPort {
  public static readonly provider: ClassProvider<IProductStockPostSubtractTransactionPort> = {
    provide: PRODUCT_STOCK_POST_SUBTRACT_TRANSACTION_PORT,
    useClass: ProductStockPostSubtractTransactionAdapter,
  };

  constructor(
    @Inject(TRANSACTION_PORT)
    private readonly transaction: ITransactionPort,
  ) {}

  public async run<T>(work: () => Promise<T>): Promise<T> {
    return await this.transaction.run(work);
  }
}
