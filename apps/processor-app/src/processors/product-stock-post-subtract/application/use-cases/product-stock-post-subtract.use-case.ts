import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  PRODUCT_STOCK_POST_SUBTRACT_ARCHIVE_PORT,
  PRODUCT_STOCK_POST_SUBTRACT_ON_HAND_PORT,
  PRODUCT_STOCK_POST_SUBTRACT_REPOSITORY_PORT,
  PRODUCT_STOCK_POST_SUBTRACT_TRANSACTION_PORT,
  type IProductStockPostSubtractArchivePort,
  type IProductStockPostSubtractOnHandPort,
  type IProductStockPostSubtractRepositoryPort,
  type IProductStockPostSubtractTransactionPort,
} from '../../outbound';
import type { IProductStockPostSubtractCommand } from '../interfaces';

@Injectable()
export class ProductStockPostSubtractUseCase {
  constructor(
    @Inject(PRODUCT_STOCK_POST_SUBTRACT_REPOSITORY_PORT)
    private readonly repository: IProductStockPostSubtractRepositoryPort,
    @Inject(PRODUCT_STOCK_POST_SUBTRACT_ON_HAND_PORT)
    private readonly onHand: IProductStockPostSubtractOnHandPort,
    @Inject(PRODUCT_STOCK_POST_SUBTRACT_ARCHIVE_PORT)
    private readonly archive: IProductStockPostSubtractArchivePort,
    @Inject(PRODUCT_STOCK_POST_SUBTRACT_TRANSACTION_PORT)
    private readonly transaction: IProductStockPostSubtractTransactionPort,
    @InjectPinoLogger(ProductStockPostSubtractUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IProductStockPostSubtractCommand): Promise<void> {
    await this.transaction.run(() => this.archiveOutOfStock(command));
  }

  private async archiveOutOfStock(command: IProductStockPostSubtractCommand): Promise<void> {
    const { productIds } = command;
    const stockOnHand = await this.onHand.lock({ productIds });
    const outOfStockProductIds = stockOnHand
      .filter((row) => row.quantity <= 0)
      .map((row) => row.productId);
    const active = await this.repository.findActive(outOfStockProductIds);
    const activeIds = active.map((product) => product.id);

    for (const productId of activeIds) {
      const archiveResult = await this.archive.archive({ productId });

      if (archiveResult.archived) {
        this.logger.info({ productId }, 'Out-of-stock product archived');
      }
    }
  }
}
