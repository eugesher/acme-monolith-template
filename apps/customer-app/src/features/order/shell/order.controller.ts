import { Body, Controller, Get, Param, Post, Query, UseFilters } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@acme-libs/auth';
import { ApiErrorResponses, ApiIdempotencyKeyHeader, IdempotencyKey } from '@acme-libs/http';
import type { IAuthCurrentUserView } from '@acme-libs/contracts/auth';

import { OrderGetDetailsCase, OrderGetListCase, OrderPlaceCase } from '../application';
import { OrderExceptionCodeEnum } from '../domain';
import {
  OrderGetListQueryDto,
  OrderHttpExceptionFilter,
  OrderIdParamDto,
  OrderPlaceRequestDto,
  OrderResponseDto,
  OrderSummaryPageResponseDto,
} from '../presentation';

@ApiTags('Order')
@UseFilters(OrderHttpExceptionFilter)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly placeCase: OrderPlaceCase,
    private readonly getListCase: OrderGetListCase,
    private readonly getDetailsCase: OrderGetDetailsCase,
  ) {}

  @Post()
  @ApiIdempotencyKeyHeader()
  @ApiOperation({ summary: 'Place an order for active products in stock (idempotent)' })
  @ApiCreatedResponse({ type: OrderResponseDto })
  @ApiErrorResponses({
    filterStatus: OrderHttpExceptionFilter.STATUS,
    codes: [
      OrderExceptionCodeEnum.ORDER_EMPTY,
      OrderExceptionCodeEnum.ORDER_PRODUCT_NOT_FOUND,
      OrderExceptionCodeEnum.ORDER_STOCK_INSUFFICIENT,
      OrderExceptionCodeEnum.ORDER_IDEMPOTENT_REQUEST_IN_FLIGHT,
      OrderExceptionCodeEnum.ORDER_IDEMPOTENCY_KEY_REUSED,
    ],
  })
  public async place(
    @CurrentUser() user: IAuthCurrentUserView,
    @Body() body: OrderPlaceRequestDto,
    @IdempotencyKey() idempotencyKey: string,
  ): Promise<OrderResponseDto> {
    const { id: customerId } = user;
    const { productIds } = body;

    return await this.placeCase.execute({ customerId, productIds, idempotencyKey });
  }

  @Get()
  @ApiOperation({ summary: 'List the orders of the caller, newest first' })
  @ApiOkResponse({ type: OrderSummaryPageResponseDto })
  public async getList(
    @CurrentUser() user: IAuthCurrentUserView,
    @Query() query: OrderGetListQueryDto,
  ): Promise<OrderSummaryPageResponseDto> {
    const { id: customerId } = user;
    const { page, limit } = query;

    return await this.getListCase.execute({ customerId, page, limit });
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Read one order of the caller with its products' })
  @ApiOkResponse({ type: OrderResponseDto })
  @ApiErrorResponses({
    filterStatus: OrderHttpExceptionFilter.STATUS,
    codes: [OrderExceptionCodeEnum.ORDER_NOT_FOUND],
  })
  public async getDetails(
    @CurrentUser() user: IAuthCurrentUserView,
    @Param() params: OrderIdParamDto,
  ): Promise<OrderResponseDto> {
    const { id: customerId } = user;
    const { orderId } = params;

    return await this.getDetailsCase.execute({ customerId, orderId });
  }
}
