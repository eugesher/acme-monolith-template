import { ApiResponseProperty } from '@nestjs/swagger';

import { PageResponseType } from '@acme-libs/http';
import { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';

class LedgerEntryPageResponseItemDto {
  @ApiResponseProperty({ example: '4210' })
  public id: string;

  @ApiResponseProperty({ example: 'product-archived:12' })
  public operationKey: string;

  @ApiResponseProperty({ example: LedgerSubjectTypeEnum.PRODUCT })
  public subjectType: string;

  @ApiResponseProperty({ example: '12' })
  public subjectId: string;

  @ApiResponseProperty({ example: LedgerActionEnum.PRODUCT_ARCHIVED })
  public action: string;

  @ApiResponseProperty({ example: { title: 'Lamp' } })
  public payload: Record<string, unknown>;

  @ApiResponseProperty({ example: '0b8f4f9e-4c1d-4a8e-9a57-3f1e2d6c7b90' })
  public correlationId: string;

  @ApiResponseProperty({ example: '2026-01-01T00:00:00.000Z' })
  public occurredAt: string;

  @ApiResponseProperty({ example: '2026-01-01T00:00:00.000Z' })
  public recordedAt: string;
}

export class LedgerEntryPageResponseDto extends PageResponseType(LedgerEntryPageResponseItemDto) {}
