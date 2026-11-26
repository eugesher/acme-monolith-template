import { ApiResponseProperty } from '@nestjs/swagger';

import { AppNameEnum } from '@acme-libs/kernel';
import { HealthLivenessStatusEnum } from '@acme-libs/kernel';

export class HealthLivenessResponseDto {
  @ApiResponseProperty({
    enum: HealthLivenessStatusEnum,
    example: HealthLivenessStatusEnum.OK,
  })
  public status: HealthLivenessStatusEnum;

  @ApiResponseProperty({ example: AppNameEnum.STAFF_APP })
  public app: string;

  @ApiResponseProperty({ example: 128 })
  public uptimeSeconds: number;
}
