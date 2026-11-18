import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { ProductCreateModel, ProductSkuTakenException } from '../../domain';
import {
  PRODUCT_CREATE_REPOSITORY_PORT,
  PRODUCT_LEDGER_PORT,
  ProductCreateInsertOutcomeEnum,
  type IProductCreateRepositoryPort,
  type IProductLedgerPort,
} from '../../outbound';
import type { IProductCreateCommand, IProductView } from '../interfaces';

@Injectable()
export class ProductCreateUseCase {
  constructor(
    @Inject(PRODUCT_CREATE_REPOSITORY_PORT)
    private readonly repository: IProductCreateRepositoryPort,
    @Inject(PRODUCT_LEDGER_PORT)
    private readonly ledger: IProductLedgerPort,
    @InjectPinoLogger(ProductCreateUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IProductCreateCommand): Promise<IProductView> {
    const { sku, name } = command;
    const isSkuTaken = await this.repository.existsBySku(sku);

    if (isSkuTaken) {
      throw new ProductSkuTakenException(sku);
    }

    const productCandidate = ProductCreateModel.initCandidate({ sku, name });
    const insertResult = await this.repository.insert(productCandidate);

    if (insertResult.outcome === ProductCreateInsertOutcomeEnum.DUPLICATE) {
      throw new ProductSkuTakenException(productCandidate.sku);
    }

    const productRecord = await this.repository.findInserted(insertResult.id);
    const product = ProductCreateModel.reconstitute(productRecord);
    const productLedgerPayload = product.toLedgerPayload();
    const productLoggerPayload = product.toLoggerPayload();

    await this.ledger.recordCreated(productLedgerPayload);

    this.logger.info(productLoggerPayload, 'Product created');

    return product.toSnapshot();
  }
}
