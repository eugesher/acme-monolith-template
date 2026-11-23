import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import {
  PRODUCT_CORE_PORT,
  ProductCoreArchiveOutcomeEnum,
  type IProductCorePort,
} from '@acme-core/contracts/product';

import {
  PRODUCT_STOCK_POST_SUBTRACT_ARCHIVE_PORT,
  type IProductStockPostSubtractArchiveCommand,
  type IProductStockPostSubtractArchivePort,
  type IProductStockPostSubtractArchiveView,
} from '../../outbound';

@Injectable()
export class ProductStockPostSubtractArchiveCoreAdapter implements IProductStockPostSubtractArchivePort {
  public static readonly PROVIDER: ClassProvider<IProductStockPostSubtractArchivePort> = {
    provide: PRODUCT_STOCK_POST_SUBTRACT_ARCHIVE_PORT,
    useClass: ProductStockPostSubtractArchiveCoreAdapter,
  };

  constructor(
    @Inject(PRODUCT_CORE_PORT)
    private readonly product: IProductCorePort,
  ) {}

  public async archive(
    command: IProductStockPostSubtractArchiveCommand,
  ): Promise<IProductStockPostSubtractArchiveView> {
    const { productId } = command;
    const archiveResult = await this.product.handleArchive({
      productId,
      expectedVersion: undefined,
    });
    const { outcome } = archiveResult;

    return { archived: outcome === ProductCoreArchiveOutcomeEnum.ARCHIVED };
  }
}
