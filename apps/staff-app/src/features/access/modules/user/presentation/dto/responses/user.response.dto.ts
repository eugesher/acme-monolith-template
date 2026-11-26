import { ApiResponseProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiResponseProperty({ example: '4' })
  public id: string;

  @ApiResponseProperty({ example: 'editor@example.com' })
  public email: string;
}
