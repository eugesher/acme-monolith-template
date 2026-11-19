import { ApiResponseProperty } from '@nestjs/swagger';

export class UserRolesResponseDto {
  @ApiResponseProperty({ example: '4' })
  public id: string;

  @ApiResponseProperty({ example: ['2', '3'] })
  public roleIds: readonly string[];
}
