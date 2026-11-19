import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class UserIdParamDto {
  @ApiProperty({ example: '4', description: 'A positive integer of up to 20 digits' })
  @Matches(/^[1-9]\d{0,19}$/, { message: 'userId must be a positive integer' })
  public userId: string;
}
