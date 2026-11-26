import { ApiResponseProperty } from '@nestjs/swagger';

import { PageResponseType } from '@acme-libs/http';

class OrderSummaryPageResponseItemDto {
  @ApiResponseProperty({ example: '600' })
  public id: string;

  @ApiResponseProperty({ example: '2026-01-01T00:00:00.000Z' })
  public createdAt: string;
}

export class OrderSummaryPageResponseDto extends PageResponseType(
  OrderSummaryPageResponseItemDto,
) {}
