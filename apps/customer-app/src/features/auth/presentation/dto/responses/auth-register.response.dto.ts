import { ApiResponseProperty } from '@nestjs/swagger';

export class AuthRegisterResponseDto {
  @ApiResponseProperty({ example: '11' })
  public id: string;

  @ApiResponseProperty({ example: 'eve@example.com' })
  public email: string;
}
