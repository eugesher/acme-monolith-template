import { ApiResponseProperty } from '@nestjs/swagger';

export class AuthAccessTokenResponseDto {
  @ApiResponseProperty({
    example: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiYXVkIjoic3RhZmYifQ.c2lnbmF0dXJl',
  })
  public accessToken: string;
}
