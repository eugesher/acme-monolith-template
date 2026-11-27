import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { ProductPublishModel } from '../../domain';
import {
  PRODUCT_CATALOG_CACHE_PORT,
  PRODUCT_LEDGER_PORT,
  type IProductCatalogCachePort,
  type IProductLedgerPort,
} from '../../outbound';
import { ProductWriteService } from '../services/product-write.service';
import type { IProductPublishCommand, IProductView } from '../types';

@Injectable()
export class ProductPublishCase {
  constructor(
    private readonly writeService: ProductWriteService,
    @Inject(PRODUCT_CATALOG_CACHE_PORT)
    private readonly catalogCache: IProductCatalogCachePort,
    @Inject(PRODUCT_LEDGER_PORT)
    private readonly ledger: IProductLedgerPort,
    @InjectPinoLogger(ProductPublishCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IProductPublishCommand): Promise<IProductView> {
    const { productId, expectedVersion } = command;
    const writeResult = await this.writeService.write(
      { productId, expectedVersion },
      ProductPublishModel.reconstitute,
      (product) => product.publish(),
    );
    const { product, answer: previousStatus } = writeResult;

    await this.catalogCache.invalidate();

    if (previousStatus) {
      const productLedgerPayload = product.toLedgerPayload(previousStatus);

      await this.ledger.appendPublished(productLedgerPayload);
    }

    const productLoggerPayload = product.toLoggerPayload();

    this.logger.info(productLoggerPayload, 'Product published');

    return product.toSnapshot();
  }
}
