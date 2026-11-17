import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  ProductIdempotencyKeyReusedException,
  ProductIdempotentRequestInFlightException,
  ProductModel,
  ProductSkuTakenException,
  type IProductCandidate,
} from '../../domain';
import {
  PRODUCT_CREATE_REPOSITORY_PORT,
  PRODUCT_IDEMPOTENCY_PORT,
  PRODUCT_LEDGER_PORT,
  PRODUCT_TRANSACTION_PORT,
  ProductCreateInsertOutcomeEnum,
  ProductIdempotencyOutcomeEnum,
  type IProductCreateRepositoryPort,
  type IProductIdempotencyPort,
  type IProductLedgerPort,
  type IProductTransactionPort,
} from '../../outbound';
import type { IProductCreateCommand, IProductView } from '../interfaces';

@Injectable()
export class ProductCreateUseCase {
  constructor(
    @Inject(PRODUCT_CREATE_REPOSITORY_PORT)
    private readonly repository: IProductCreateRepositoryPort,
    @Inject(PRODUCT_IDEMPOTENCY_PORT)
    private readonly idempotency: IProductIdempotencyPort,
    @Inject(PRODUCT_LEDGER_PORT)
    private readonly ledger: IProductLedgerPort,
    @Inject(PRODUCT_TRANSACTION_PORT)
    private readonly transaction: IProductTransactionPort,
    @InjectPinoLogger(ProductCreateUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IProductCreateCommand): Promise<IProductView> {
    const { sku, name, staffUserId, idempotencyKey } = command;
    const idempotencyClaim = await this.idempotency.claim<IProductView>({
      staffUserId,
      key: idempotencyKey,
      body: { sku, name },
    });

    if (idempotencyClaim.outcome === ProductIdempotencyOutcomeEnum.REPLAY) {
      const replayLoggerPayload = ProductModel.toCreateReplayLoggerPayload(idempotencyKey);

      this.logger.info(replayLoggerPayload, 'Product creation replayed from the idempotency store');

      return idempotencyClaim.storedResponse;
    }

    if (idempotencyClaim.outcome === ProductIdempotencyOutcomeEnum.IN_FLIGHT) {
      throw new ProductIdempotentRequestInFlightException(idempotencyKey);
    }

    if (idempotencyClaim.outcome === ProductIdempotencyOutcomeEnum.MISMATCH) {
      throw new ProductIdempotencyKeyReusedException(idempotencyKey);
    }

    const product = await this.write(command);
    const productLedgerPayload = product.toCreateLedgerPayload();
    const productLoggerPayload = product.toCreateLoggerPayload();

    await this.ledger.recordCreated(productLedgerPayload);

    this.logger.info(productLoggerPayload, 'Product created');

    return product.toSnapshot();
  }

  private async write(command: IProductCreateCommand): Promise<ProductModel> {
    const { staffUserId, idempotencyKey } = command;

    try {
      return await this.create(command);
    } catch (error) {
      await this.idempotency.release({ staffUserId, key: idempotencyKey });

      throw error;
    }
  }

  private async create(command: IProductCreateCommand): Promise<ProductModel> {
    const { sku, name } = command;
    const isSkuTaken = await this.repository.existsBySku(sku);

    if (isSkuTaken) {
      throw new ProductSkuTakenException(sku);
    }

    const productCandidate = ProductModel.initCandidate({ sku, name });

    return await this.transaction.run(() => this.persist(productCandidate, command));
  }

  private async persist(
    candidate: IProductCandidate,
    command: IProductCreateCommand,
  ): Promise<ProductModel> {
    const { staffUserId, idempotencyKey } = command;
    const insertResult = await this.repository.insert(candidate);

    if (insertResult.outcome === ProductCreateInsertOutcomeEnum.DUPLICATE) {
      throw new ProductSkuTakenException(candidate.sku);
    }

    const productRecord = await this.repository.findInserted(insertResult.id);
    const createdProduct = ProductModel.reconstitute(productRecord);
    const productView = createdProduct.toSnapshot();

    await this.idempotency.complete({ staffUserId, key: idempotencyKey, response: productView });

    return createdProduct;
  }
}
