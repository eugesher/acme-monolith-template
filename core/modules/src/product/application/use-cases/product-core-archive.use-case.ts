import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  ProductCoreArchiveOutcomeEnum,
  type IProductCoreArchiveCommand,
  type IProductCoreArchiveView,
} from '@acme-core/contracts/product';

import { ProductCoreArchiveModel } from '../../domain';
import {
  PRODUCT_CORE_ARCHIVE_REPOSITORY_PORT,
  PRODUCT_CORE_CATALOG_CACHE_PORT,
  PRODUCT_CORE_LEDGER_PORT,
  PRODUCT_CORE_TRANSACTION_PORT,
  type IProductCoreArchiveRepositoryPort,
  type IProductCoreCatalogCachePort,
  type IProductCoreLedgerPort,
  type IProductCoreTransactionPort,
} from '../../outbound';

@Injectable()
export class ProductCoreArchiveUseCase {
  constructor(
    @Inject(PRODUCT_CORE_ARCHIVE_REPOSITORY_PORT)
    private readonly repository: IProductCoreArchiveRepositoryPort,
    @Inject(PRODUCT_CORE_CATALOG_CACHE_PORT)
    private readonly catalogCache: IProductCoreCatalogCachePort,
    @Inject(PRODUCT_CORE_LEDGER_PORT)
    private readonly ledger: IProductCoreLedgerPort,
    @Inject(PRODUCT_CORE_TRANSACTION_PORT)
    private readonly transaction: IProductCoreTransactionPort,
    @InjectPinoLogger(ProductCoreArchiveUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IProductCoreArchiveCommand): Promise<IProductCoreArchiveView> {
    const { productId } = command;
    const archiveView = await this.transaction.run(() => this.archive(command));
    const { outcome, currentVersion } = archiveView;

    if (outcome === ProductCoreArchiveOutcomeEnum.ARCHIVED) {
      this.logger.info({ id: productId, version: currentVersion }, 'Product archived');
    }

    return archiveView;
  }

  private async archive(command: IProductCoreArchiveCommand): Promise<IProductCoreArchiveView> {
    const { productId, expectedVersion } = command;
    const productRecord = await this.repository.lockById(productId);

    if (!productRecord) {
      return { outcome: ProductCoreArchiveOutcomeEnum.NOT_FOUND, currentVersion: undefined };
    }

    const product = ProductCoreArchiveModel.reconstitute(productRecord);

    if (!product.isExpectedVersion(expectedVersion)) {
      return {
        outcome: ProductCoreArchiveOutcomeEnum.VERSION_MISMATCH,
        currentVersion: product.version,
      };
    }

    if (product.isArchived) {
      return {
        outcome: ProductCoreArchiveOutcomeEnum.ALREADY_ARCHIVED,
        currentVersion: product.version,
      };
    }

    const versionAsRead = product.version;
    const previousStatus = product.status;

    product.archive();

    const productUpdatePayload = product.toUpdatePayload(versionAsRead);

    await this.repository.update(productUpdatePayload);

    const archiveLedgerPayload = product.toLedgerPayload(previousStatus);

    this.transaction.afterCommit(() => this.catalogCache.invalidate());
    this.transaction.afterCommit(() => this.ledger.recordArchived(archiveLedgerPayload));

    return { outcome: ProductCoreArchiveOutcomeEnum.ARCHIVED, currentVersion: product.version };
  }
}
