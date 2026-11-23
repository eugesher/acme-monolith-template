import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseFilters } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, RequiresPermission } from '@acme-libs/auth';
import { ApiErrorResponses, ApiIdempotencyKeyHeader, IdempotencyKey } from '@acme-libs/http';
import { PermissionCodeEnum } from '@acme-libs/kernel';
import type { IAuthCurrentUserView } from '@acme-libs/contracts/auth';

import { ProductStockAddUseCase } from '../application';
import { ProductStockExceptionCodeEnum } from '../domain';
import {
  ProductStockAddRequestDto,
  ProductStockHttpExceptionFilter,
  ProductStockProductIdParamDto,
  ProductStockResponseDto,
} from '../presentation';

@ApiTags('Warehouse/ProductStock')
@UseFilters(ProductStockHttpExceptionFilter)
@Controller('warehouse/product-stock')
export class ProductStockController {
  constructor(private readonly add: ProductStockAddUseCase) {}

  @Post(':productId/add')
  @HttpCode(HttpStatus.OK)
  @RequiresPermission(PermissionCodeEnum.PRODUCT_RESTOCK)
  @ApiIdempotencyKeyHeader()
  @ApiOperation({ summary: 'Add units to the stock of a product (idempotent)' })
  @ApiOkResponse({ type: ProductStockResponseDto })
  @ApiErrorResponses({
    statuses: ProductStockHttpExceptionFilter.STATUS,
    codes: [
      ProductStockExceptionCodeEnum.PRODUCT_STOCK_QUANTITY_INVALID,
      ProductStockExceptionCodeEnum.PRODUCT_STOCK_PRODUCT_NOT_FOUND,
      ProductStockExceptionCodeEnum.PRODUCT_STOCK_IDEMPOTENT_REQUEST_IN_FLIGHT,
      ProductStockExceptionCodeEnum.PRODUCT_STOCK_IDEMPOTENCY_KEY_REUSED,
    ],
  })
  public async handleAdd(
    @CurrentUser() user: IAuthCurrentUserView,
    @Param() params: ProductStockProductIdParamDto,
    @Body() body: ProductStockAddRequestDto,
    @IdempotencyKey() idempotencyKey: string,
  ): Promise<ProductStockResponseDto> {
    const { id: staffUserId } = user;
    const { productId } = params;
    const { quantity } = body;

    return await this.add.execute({ productId, quantity, staffUserId, idempotencyKey });
  }
}
