import { ApiProperty } from '@nestjs/swagger';

import { PermissionCodeEnum } from '@acme-libs/kernel';

export class PermissionListResponseDto {
  @ApiProperty({
    readOnly: true,
    enum: PermissionCodeEnum,
    isArray: true,
    example: [PermissionCodeEnum.LEDGER_READ, PermissionCodeEnum.PRODUCT_READ],
  })
  public codes: PermissionCodeEnum[];
}
