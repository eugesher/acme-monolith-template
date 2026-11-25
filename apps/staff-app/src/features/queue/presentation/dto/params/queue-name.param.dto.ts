import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

import { QueueNameEnum } from '@acme-libs/kernel';

export class QueueNameParamDto {
  @ApiProperty({ example: QueueNameEnum.LEDGER_RECORD })
  @IsString()
  @MaxLength(64)
  public queueName: string;
}
