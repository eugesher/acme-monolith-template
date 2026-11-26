import { ApiResponseProperty } from '@nestjs/swagger';

export class AuthMeResponseDto {
  @ApiResponseProperty({ example: '10' })
  public id: string;

  @ApiResponseProperty({ example: 'ann@example.com' })
  public email: string;
}
