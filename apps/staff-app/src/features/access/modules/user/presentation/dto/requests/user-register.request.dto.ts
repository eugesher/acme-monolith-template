import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

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

  @ApiProperty({ isArray: true, example: ['2'] })
  @IsArray()
  @Matches(/^[1-9]\d{0,19}$/, { each: true, message: 'roleIds must be positive integers' })
  public roleIds: string[];
}
