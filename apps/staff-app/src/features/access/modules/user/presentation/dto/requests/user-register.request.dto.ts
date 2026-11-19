import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { IsEntityId } from '@acme-libs/http';

export class UserRegisterRequestDto {
  @ApiProperty({ example: 'editor@example.com' })
  @IsEmail()
  @MaxLength(255)
  public email: string;

  @ApiProperty({ example: 'change-me-please-32' })
  @IsString()
  @MinLength(12)
  @MaxLength(256)
  public password: string;

  @IsEntityId({
    example: ['2'],
    description: 'The ids of the roles the user holds',
    each: true,
  })
  @IsArray()
  public roleIds: string[];
}
