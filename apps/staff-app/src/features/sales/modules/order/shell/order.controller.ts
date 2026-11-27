import { Body, Controller, Get, Param, Put, Query, UseFilters } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiresPermission } from '@acme-libs/auth';
import { ApiErrorResponses } from '@acme-libs/http';
import { PermissionCodeEnum } from '@acme-libs/kernel';

import {
  OrderGetManyCase,
  OrderGetOneCase,
  OrderGetTagsCase,
  OrderReplaceTagsCase,
} from '../application';
import { OrderExceptionCodeEnum } from '../domain';
import {
  OrderGetManyQueryDto,
  OrderHttpExceptionFilter,
  OrderIdParamDto,
  OrderResponseDto,
  OrderSummaryPageResponseDto,
  OrderTagsReplaceRequestDto,
  OrderTagsResponseDto,
} from '../presentation';

@ApiTags('Sales/Order')
@UseFilters(OrderHttpExceptionFilter)
@Controller('sales/orders')
export class OrderController {
  constructor(
    private readonly getManyCase: OrderGetManyCase,
    private readonly getOneCase: OrderGetOneCase,
    private readonly getTagsCase: OrderGetTagsCase,
    private readonly replaceTagsCase: OrderReplaceTagsCase,
  ) {}

  @Get()
  @RequiresPermission(PermissionCodeEnum.ORDER_READ)
  @ApiOperation({ summary: 'List the orders of all customers, newest first, optionally by tag' })
  @ApiOkResponse({ type: OrderSummaryPageResponseDto })
  public async getMany(@Query() query: OrderGetManyQueryDto): Promise<OrderSummaryPageResponseDto> {
    const { page, limit, tagId } = query;

    return await this.getManyCase.execute({ page, limit, tagId });
  }

  @Get(':orderId')
  @RequiresPermission(PermissionCodeEnum.ORDER_READ)
  @ApiOperation({ summary: 'Read one order with its products' })
  @ApiOkResponse({ type: OrderResponseDto })
  @ApiErrorResponses({
    filterStatus: OrderHttpExceptionFilter.STATUS,
    codes: [OrderExceptionCodeEnum.ORDER_NOT_FOUND],
  })
  public async getOne(@Param() params: OrderIdParamDto): Promise<OrderResponseDto> {
    const { orderId } = params;

    return await this.getOneCase.execute({ orderId });
  }

  @Get(':orderId/tags')
  @RequiresPermission(PermissionCodeEnum.ORDER_READ)
  @ApiOperation({ summary: 'Read the tags of an order, by name' })
  @ApiOkResponse({ type: OrderTagsResponseDto })
  @ApiErrorResponses({
    filterStatus: OrderHttpExceptionFilter.STATUS,
    codes: [OrderExceptionCodeEnum.ORDER_NOT_FOUND],
  })
  public async getTags(@Param() params: OrderIdParamDto): Promise<OrderTagsResponseDto> {
    const { orderId } = params;

    return await this.getTagsCase.execute({ orderId });
  }

  @Put(':orderId/tags')
  @RequiresPermission(PermissionCodeEnum.ORDER_WRITE)
  @ApiOperation({ summary: 'Replace the tags of an order' })
  @ApiOkResponse({ type: OrderTagsResponseDto })
  @ApiErrorResponses({
    filterStatus: OrderHttpExceptionFilter.STATUS,
    codes: [OrderExceptionCodeEnum.ORDER_NOT_FOUND, OrderExceptionCodeEnum.ORDER_TAG_NOT_FOUND],
  })
  public async replaceTags(
    @Param() params: OrderIdParamDto,
    @Body() body: OrderTagsReplaceRequestDto,
  ): Promise<OrderTagsResponseDto> {
    const { orderId } = params;
    const { tagIds } = body;

    return await this.replaceTagsCase.execute({ orderId, tagIds });
  }
}
