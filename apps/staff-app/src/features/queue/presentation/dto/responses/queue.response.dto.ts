import { ApiResponseProperty } from '@nestjs/swagger';

import { QueueNameEnum } from '@acme-libs/kernel';

class QueueResponseJobCountsDto {
  @ApiResponseProperty({ example: 0 })
  public active: number;

  @ApiResponseProperty({ example: 0 })
  public completed: number;

  @ApiResponseProperty({ example: 2 })
  public failed: number;

  @ApiResponseProperty({ example: 0 })
  public delayed: number;

  @ApiResponseProperty({ example: 5 })
  public waiting: number;
}

export class QueueResponseDto {
  @ApiResponseProperty({ example: QueueNameEnum.LEDGER_RECORD })
  public name: string;

  @ApiResponseProperty({ example: false })
  public paused: boolean;

  @ApiResponseProperty({ type: QueueResponseJobCountsDto })
  public jobCounts: QueueResponseJobCountsDto;
}
