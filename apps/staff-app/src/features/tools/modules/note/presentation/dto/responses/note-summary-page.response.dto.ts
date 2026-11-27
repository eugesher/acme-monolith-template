import { ApiResponseProperty } from '@nestjs/swagger';

import { PageResponseType } from '@acme-libs/http';

class NoteSummaryPageResponseItemDto {
  @ApiResponseProperty({ example: '17' })
  public id: string;

  @ApiResponseProperty({ example: 'product' })
  public subjectType: string;

  @ApiResponseProperty({ example: '42' })
  public subjectId: string;

  @ApiResponseProperty({ example: 'Refund call' })
  public title: string;

  @ApiResponseProperty({ example: '2' })
  public authorId: string;

  @ApiResponseProperty({ example: false })
  public resolved: boolean;

  @ApiResponseProperty({ example: 1 })
  public version: number;

  @ApiResponseProperty({ example: '2026-01-01T00:00:00.000Z' })
  public createdAt: string;

  @ApiResponseProperty({ example: '2026-01-01T00:00:00.000Z' })
  public updatedAt: string;
}

export class NoteSummaryPageResponseDto extends PageResponseType(NoteSummaryPageResponseItemDto) {}
