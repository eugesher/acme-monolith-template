import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { OccRetryHelper } from '@acme-libs/toolkit';

import {
  ProductNotFoundException,
  ProductVersionConflictException,
  ProductVersionMismatchException,
  type IProductReconstitute,
  type ProductAggregate,
} from '../../domain';
import {
  PRODUCT_OCC_RETRY_ATTEMPTS_TOKEN,
  PRODUCT_WRITE_REPOSITORY_PORT,
  type IProductWriteRepositoryPort,
} from '../../outbound';
import { ProductWriteConflictError } from '../errors/product-write-conflict.error';
import { ProductAccessService } from './product-access.service';
import type { IProductWriteCommand, IProductWriteView } from '../types';

@Injectable()
export class ProductWriteService {
  constructor(
    private readonly accessService: ProductAccessService,
    @Inject(PRODUCT_WRITE_REPOSITORY_PORT)
    private readonly repository: IProductWriteRepositoryPort,
    @Inject(PRODUCT_OCC_RETRY_ATTEMPTS_TOKEN)
    private readonly occRetryAttempts: number,
    @InjectPinoLogger(ProductWriteService.name)
    private readonly logger: PinoLogger,
  ) {}

  public async write<TProduct extends ProductAggregate, TAnswer>(
    command: IProductWriteCommand,
    reconstitute: (record: IProductReconstitute) => TProduct,
    mutate: (product: TProduct) => TAnswer,
  ): Promise<IProductWriteView<TProduct, TAnswer>> {
    const { productId, expectedVersion } = command;
    const maxAttempts = expectedVersion === undefined ? this.occRetryAttempts : 1;

    return await OccRetryHelper.run(() => this.attempt(command, reconstitute, mutate), {
      subject: 'Product',
      logger: this.logger,
      maxAttempts,
      isConflict: (error): error is ProductWriteConflictError =>
        error instanceof ProductWriteConflictError,
      retryContext: (conflict) => ({ id: productId, version: conflict.currentVersion }),
      exhaustedContext: () => ({ id: productId }),
      onExhausted: (conflict, attempts) => {
        if (expectedVersion !== undefined) {
          throw new ProductVersionMismatchException(
            productId,
            expectedVersion,
            conflict.currentVersion,
          );
        }

        throw new ProductVersionConflictException(productId, attempts, conflict.currentVersion);
      },
    });
  }

  private async attempt<TProduct extends ProductAggregate, TAnswer>(
    command: IProductWriteCommand,
    reconstitute: (record: IProductReconstitute) => TProduct,
    mutate: (product: TProduct) => TAnswer,
  ): Promise<IProductWriteView<TProduct, TAnswer>> {
    const { productId, expectedVersion } = command;
    const product = await this.accessService.load({ productId }, reconstitute);

    product.assertExpectedVersion(expectedVersion);

    const versionAsRead = product.version;

    const answer = mutate(product);

    if (product.version === versionAsRead) {
      return { product, answer };
    }

    const productUpdatePayload = product.toUpdatePayload(versionAsRead);
    const isUpdated = await this.repository.update(productUpdatePayload);

    if (!isUpdated) {
      const currentProduct = await this.load(productId, reconstitute);

      throw new ProductWriteConflictError(productId, currentProduct.version);
    }

    const savedProduct = await this.load(productId, reconstitute);

    return { product: savedProduct, answer };
  }

  private async load<TProduct>(
    productId: string,
    reconstitute: (record: IProductReconstitute) => TProduct,
  ): Promise<TProduct> {
    const productRecord = await this.repository.findById(productId);

    if (!productRecord) {
      throw new ProductNotFoundException(productId);
    }

    return reconstitute(productRecord);
  }
}
