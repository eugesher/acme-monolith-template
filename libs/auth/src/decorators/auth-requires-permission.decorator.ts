import { SetMetadata, type CustomDecorator } from '@nestjs/common';

import type { PermissionCodeEnum } from '@acme-libs/kernel';

import { AuthMetadataKeyEnum } from '../types';

export const RequiresPermission = (permission: PermissionCodeEnum): CustomDecorator =>
  SetMetadata(AuthMetadataKeyEnum.PERMISSION, permission);
