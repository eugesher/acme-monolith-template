import { ApiResponseProperty } from '@nestjs/swagger';

export class AuthAccessTokenResponseDto {
  @ApiResponseProperty({
    example: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMCIsImF1ZCI6ImN1c3RvbWVyIn0.c2lnbmF0dXJl',
  })
  public accessToken: string;
}
