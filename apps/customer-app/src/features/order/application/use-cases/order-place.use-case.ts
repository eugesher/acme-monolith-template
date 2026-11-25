import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  OrderCandidateModel,
  OrderIdempotencyKeyReusedException,
  OrderIdempotentRequestInFlightException,
  OrderPlaceModel,
} from '../../domain';
import {
  ORDER_IDEMPOTENCY_PORT,
  ORDER_LEDGER_PORT,
  ORDER_PLACE_REPOSITORY_PORT,
  ORDER_PRODUCT_STOCK_PORT,
  ORDER_TRANSACTION_PORT,
  OrderIdempotencyOutcomeEnum,
  type IOrderIdempotencyPort,
  type IOrderLedgerPort,
  type IOrderPlaceRepositoryPort,
  type IOrderProductStockPort,
  type IOrderTransactionPort,
} from '../../outbound';
import type { IOrderPlaceCommand, IOrderView } from '../types';

@Injectable()
export class OrderPlaceUseCase {
  constructor(
    @Inject(ORDER_PLACE_REPOSITORY_PORT)
    private readonly repository: IOrderPlaceRepositoryPort,
    @Inject(ORDER_PRODUCT_STOCK_PORT)
    private readonly productStock: IOrderProductStockPort,
    @Inject(ORDER_IDEMPOTENCY_PORT)
    private readonly idempotency: IOrderIdempotencyPort,
    @Inject(ORDER_LEDGER_PORT)
    private readonly ledger: IOrderLedgerPort,
    @Inject(ORDER_TRANSACTION_PORT)
    private readonly transaction: IOrderTransactionPort,
    @InjectPinoLogger(OrderPlaceUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IOrderPlaceCommand): Promise<IOrderView> {
    const { customerId, productIds, idempotencyKey } = command;
    const idempotencyClaim = await this.idempotency.claim<IOrderView>({
      customerId,
      key: idempotencyKey,
      body: { productIds },
    });

    if (idempotencyClaim.outcome === OrderIdempotencyOutcomeEnum.REPLAY) {
      this.logger.info({ idempotencyKey }, 'Order placement replayed from the idempotency store');

      return idempotencyClaim.storedResponse;
    }

    if (idempotencyClaim.outcome === OrderIdempotencyOutcomeEnum.IN_FLIGHT) {
      throw new OrderIdempotentRequestInFlightException(idempotencyKey);
    }

    if (idempotencyClaim.outcome === OrderIdempotencyOutcomeEnum.MISMATCH) {
      throw new OrderIdempotencyKeyReusedException(idempotencyKey);
    }

    const order = await this.write(command);
    const orderLedgerPayload = order.toLedgerPayload();
    const orderLoggerPayload = order.toLoggerPayload();

    await this.ledger.recordPlaced(orderLedgerPayload);

    this.logger.info(orderLoggerPayload, 'Order placed');

    return order.toSnapshot();
  }

  private async write(command: IOrderPlaceCommand): Promise<OrderPlaceModel> {
    const { customerId, idempotencyKey } = command;

    try {
      return await this.transaction.run(() => this.persist(command));
    } catch (error) {
      await this.idempotency.release({ customerId, key: idempotencyKey });

      throw error;
    }
  }

  private async persist(command: IOrderPlaceCommand): Promise<OrderPlaceModel> {
    const { customerId, productIds, idempotencyKey } = command;
    const orderCandidate = OrderCandidateModel.create({ customerId, productIds });

    orderCandidate.validate();

    const stockQuantities = await this.productStock.lock({
      productIds: orderCandidate.distinctProductIds,
    });
    const activeProducts = await this.repository.findActiveMany(orderCandidate.distinctProductIds);

    orderCandidate.assertProducts(activeProducts);
    orderCandidate.assertStockQuantities(stockQuantities);

    const orderInsertPayload = orderCandidate.toInsertPayload();
    const orderId = await this.repository.insertOrder(orderInsertPayload);
    const orderProducts = orderCandidate.createOrderProducts(orderId);

    await this.repository.insertOrderProducts(orderProducts);

    const orderRecord = await this.repository.findPlaced(orderId);
    const order = OrderPlaceModel.reconstitute(orderRecord);
    const movements = order.getProductStockMovements();

    await this.productStock.withdraw({ movements });

    const orderView = order.toSnapshot();

    await this.idempotency.complete({ customerId, key: idempotencyKey, response: orderView });

    return order;
  }
}
