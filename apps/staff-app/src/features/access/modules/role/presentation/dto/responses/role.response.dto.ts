import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

import { PermissionCodeEnum } from '@acme-libs/kernel';

export class RoleResponseDto {
  @ApiResponseProperty({ example: '2' })
  public id: string;

  @ApiResponseProperty({ example: 'editor' })
  public name: string;

  @ApiProperty({
    readOnly: true,
    enum: PermissionCodeEnum,
    isArray: true,
    example: [PermissionCodeEnum.PRODUCT_READ, PermissionCodeEnum.PRODUCT_WRITE],
  })
  public permissionCodes: readonly PermissionCodeEnum[];
}
