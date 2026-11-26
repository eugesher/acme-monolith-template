import { SetMetadata, type CustomDecorator } from '@nestjs/common';

import { AuthMetadataKeyEnum, type PermissionCodeEnum } from '@acme-libs/kernel';

export const RequiresPermission = (permission: PermissionCodeEnum): CustomDecorator =>
  SetMetadata(AuthMetadataKeyEnum.PERMISSION, permission);
