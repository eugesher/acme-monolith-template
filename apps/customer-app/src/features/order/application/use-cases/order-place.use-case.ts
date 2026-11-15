import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  OrderCandidateModel,
  OrderIdempotencyKeyReusedException,
  OrderIdempotentRequestInFlightException,
  OrderModel,
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
import type { IOrderPlaceCommand, IOrderView } from '../interfaces';

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

    switch (idempotencyClaim.outcome) {
      case OrderIdempotencyOutcomeEnum.IN_FLIGHT: {
        throw new OrderIdempotentRequestInFlightException(idempotencyKey);
      }
      case OrderIdempotencyOutcomeEnum.MISMATCH: {
        throw new OrderIdempotencyKeyReusedException(idempotencyKey);
      }
      case OrderIdempotencyOutcomeEnum.REPLAY: {
        this.logger.info({ idempotencyKey }, 'Order placement replayed from the idempotency store');

        return idempotencyClaim.storedResponse;
      }
      default: {
        const orderView = await this.write(command);
        const placedProductIds = orderView.orderProducts.map(
          (orderProduct) => orderProduct.productId,
        );

        await this.ledger.recordPlaced({
          orderId: orderView.id,
          customerId,
          productIds: placedProductIds,
        });

        this.logger.info(
          { orderId: orderView.id, customerId, units: placedProductIds.length },
          'Order placed',
        );

        return orderView;
      }
    }
  }

  private async write(command: IOrderPlaceCommand): Promise<IOrderView> {
    const { customerId, idempotencyKey } = command;

    try {
      return await this.transaction.run(() => this.persist(command));
    } catch (error) {
      await this.idempotency.release({ customerId, key: idempotencyKey });

      throw error;
    }
  }

  private async persist(command: IOrderPlaceCommand): Promise<IOrderView> {
    const { customerId, productIds, idempotencyKey } = command;

    const orderCandidate = OrderCandidateModel.create({ customerId, productIds });
    orderCandidate.validate();

    const stockQuantities = await this.productStock.lock({
      productIds: orderCandidate.distinctProductIds,
    });
    const activeProducts = await this.repository.findActiveProducts(
      orderCandidate.distinctProductIds,
    );

    orderCandidate.assertProducts(activeProducts);
    orderCandidate.assertStockQuantities(stockQuantities);

    const orderId = await this.repository.insertOrder({ customerId: orderCandidate.customerId });

    const orderProducts = orderCandidate.getOrderProductCandidates(orderId);
    await this.repository.insertOrderProducts(orderProducts);

    const orderRecord = await this.repository.findPlaced(orderId);
    const order = OrderModel.reconstitute(orderRecord);
    const orderView = order.toSnapshot();
    const movements = order.getProductStockMovements();

    await this.productStock.withdraw({ movements });
    await this.idempotency.complete({ customerId, key: idempotencyKey, response: orderView });

    return orderView;
  }
}
