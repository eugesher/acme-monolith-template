import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

import { PageResponseType } from '@acme-libs/http';

class QueueFailedJobPageResponseItemDto {
  @ApiResponseProperty({ example: '42' })
  public id: string;

  @ApiResponseProperty({ example: '__default__' })
  public name: string;

  @ApiResponseProperty({ example: { operationKey: 'product-created:12' } })
  public data: unknown;

  @ApiResponseProperty({ example: 3 })
  public attempts: number;

  @ApiResponseProperty({ example: 3 })
  public attemptsMade: number;

  @ApiProperty({ readOnly: true, nullable: true, example: 'Data too long for column' })
  public failedReason: string | null;

  @ApiResponseProperty({ example: ['Error: Data too long for column'] })
  public stacktrace: string[];

  @ApiResponseProperty({ example: '2026-01-01T00:00:00.000Z' })
  public createdAt: string;

  @ApiProperty({ readOnly: true, nullable: true, example: '2026-01-01T00:00:00.500Z' })
  public processedAt: string | null;

  @ApiProperty({ readOnly: true, nullable: true, example: '2026-01-01T00:00:01.000Z' })
  public failedAt: string | null;
}

export class QueueFailedJobPageResponseDto extends PageResponseType(
  QueueFailedJobPageResponseItemDto,
) {}
