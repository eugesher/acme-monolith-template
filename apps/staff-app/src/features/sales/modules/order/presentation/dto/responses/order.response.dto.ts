import { ApiResponseProperty } from '@nestjs/swagger';

class OrderResponseItemProductDto {
  @ApiResponseProperty({ example: '100' })
  public id: string;

  @ApiResponseProperty({ example: 'SKU-0001' })
  public sku: string;

  @ApiResponseProperty({ example: 'Reference product' })
  public name: string;
}

class OrderResponseItemDto {
  @ApiResponseProperty({ example: '900' })
  public id: string;

  @ApiResponseProperty({ type: OrderResponseItemProductDto })
  public product: OrderResponseItemProductDto;
}

export class OrderResponseDto {
  @ApiResponseProperty({ example: '600' })
  public id: string;

  @ApiResponseProperty({ example: '101' })
  public customerId: string;

  @ApiResponseProperty({ example: '2026-01-01T00:00:00.000Z' })
  public createdAt: string;

  @ApiResponseProperty({ type: [OrderResponseItemDto] })
  public orderProducts: readonly OrderResponseItemDto[];
}
