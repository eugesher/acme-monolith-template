import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

import { QueueNameEnum } from '@acme-libs/kernel';

export class QueueJobParamDto {
  @ApiProperty({ example: QueueNameEnum.LEDGER_APPEND_QUEUE })
  @IsString()
  @MaxLength(64)
  public queueName: string;

  @ApiProperty({ example: '42' })
  @IsString()
  @MaxLength(128)
  public jobId: string;
}
