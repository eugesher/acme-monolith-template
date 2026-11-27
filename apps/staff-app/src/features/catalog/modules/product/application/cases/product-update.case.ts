import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { ProductUpdateModel } from '../../domain';
import { PRODUCT_CATALOG_CACHE_PORT, type IProductCatalogCachePort } from '../../outbound';
import { ProductWriteService } from '../services/product-write.service';
import type { IProductUpdateCommand, IProductView } from '../types';

@Injectable()
export class ProductUpdateCase {
  constructor(
    private readonly writeService: ProductWriteService,
    @Inject(PRODUCT_CATALOG_CACHE_PORT)
    private readonly catalogCache: IProductCatalogCachePort,
    @InjectPinoLogger(ProductUpdateCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IProductUpdateCommand): Promise<IProductView> {
    const { productId, name, expectedVersion } = command;
    const writeResult = await this.writeService.write(
      { productId, expectedVersion },
      ProductUpdateModel.reconstitute,
      (product) => product.update({ name }),
    );
    const { product } = writeResult;

    await this.catalogCache.invalidate();

    const productLoggerPayload = product.toLoggerPayload();

    this.logger.info(productLoggerPayload, 'Product updated');

    return product.toSnapshot();
  }
}
