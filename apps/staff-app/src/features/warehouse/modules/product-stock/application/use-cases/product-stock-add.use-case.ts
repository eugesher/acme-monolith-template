import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  ProductStockAddModel,
  ProductStockIdempotencyKeyReusedException,
  ProductStockIdempotentRequestInFlightException,
  ProductStockProductNotFoundException,
} from '../../domain';
import {
  PRODUCT_STOCK_ADD_REPOSITORY_PORT,
  PRODUCT_STOCK_IDEMPOTENCY_PORT,
  PRODUCT_STOCK_LEDGER_PORT,
  PRODUCT_STOCK_MOVEMENT_PORT,
  PRODUCT_STOCK_TRANSACTION_PORT,
  ProductStockIdempotencyOutcomeEnum,
  type IProductStockAddRepositoryPort,
  type IProductStockIdempotencyPort,
  type IProductStockLedgerPort,
  type IProductStockMovementPort,
  type IProductStockTransactionPort,
} from '../../outbound';
import type {
  IProductStockAddCommand,
  IProductStockAddView,
  IProductStockAddWriteView,
} from '../types';

@Injectable()
export class ProductStockAddUseCase {
  constructor(
    @Inject(PRODUCT_STOCK_ADD_REPOSITORY_PORT)
    private readonly repository: IProductStockAddRepositoryPort,
    @Inject(PRODUCT_STOCK_MOVEMENT_PORT)
    private readonly movement: IProductStockMovementPort,
    @Inject(PRODUCT_STOCK_IDEMPOTENCY_PORT)
    private readonly idempotency: IProductStockIdempotencyPort,
    @Inject(PRODUCT_STOCK_LEDGER_PORT)
    private readonly ledger: IProductStockLedgerPort,
    @Inject(PRODUCT_STOCK_TRANSACTION_PORT)
    private readonly transaction: IProductStockTransactionPort,
    @InjectPinoLogger(ProductStockAddUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IProductStockAddCommand): Promise<IProductStockAddView> {
    const { productId, quantity, staffUserId, idempotencyKey } = command;
    const idempotencyClaim = await this.idempotency.claim<IProductStockAddView>({
      staffUserId,
      key: idempotencyKey,
      body: { productId, quantity },
    });

    if (idempotencyClaim.outcome === ProductStockIdempotencyOutcomeEnum.REPLAY) {
      this.logger.info({ idempotencyKey }, 'Product restock replayed from the idempotency store');

      return idempotencyClaim.storedResponse;
    }

    if (idempotencyClaim.outcome === ProductStockIdempotencyOutcomeEnum.IN_FLIGHT) {
      throw new ProductStockIdempotentRequestInFlightException(idempotencyKey);
    }

    if (idempotencyClaim.outcome === ProductStockIdempotencyOutcomeEnum.MISMATCH) {
      throw new ProductStockIdempotencyKeyReusedException(idempotencyKey);
    }

    const writeResult = await this.write(command);
    const { stockOnHand, productStockId, productStockLedgerPayload } = writeResult;

    await this.ledger.recordAdded(productStockLedgerPayload);

    const addLoggerPayload = ProductStockAddModel.toLoggerPayload({
      productStockId,
      productId,
      quantity,
    });

    this.logger.info(addLoggerPayload, 'Product restocked');

    return stockOnHand;
  }

  private async write(command: IProductStockAddCommand): Promise<IProductStockAddWriteView> {
    const { staffUserId, idempotencyKey } = command;

    try {
      return await this.transaction.run(() => this.persist(command));
    } catch (error) {
      await this.idempotency.release({ staffUserId, key: idempotencyKey });

      throw error;
    }
  }

  private async persist(command: IProductStockAddCommand): Promise<IProductStockAddWriteView> {
    const { productId, quantity, staffUserId, idempotencyKey } = command;

    await this.movement.lock({ productId });

    const productRecord = await this.repository.findOne(productId);

    if (!productRecord) {
      throw new ProductStockProductNotFoundException(productId);
    }

    const productStock = ProductStockAddModel.reconstitute(productRecord);

    productStock.add(quantity);

    const added = await this.movement.add({ productId, quantity });
    const { productStockId, createdAt } = added;
    const stockOnHand = productStock.toOnHandSnapshot(added.quantity);
    const productStockLedgerPayload = productStock.toLedgerPayload({ productStockId, createdAt });

    await this.idempotency.complete({ staffUserId, key: idempotencyKey, response: stockOnHand });

    return { stockOnHand, productStockId, productStockLedgerPayload };
  }
}
