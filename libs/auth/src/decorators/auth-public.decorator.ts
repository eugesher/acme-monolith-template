import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { AuthMetadataKeyEnum } from '../enums/auth-metadata-key.enum';

export const Public = (): MethodDecorator & ClassDecorator =>
  applyDecorators(SetMetadata(AuthMetadataKeyEnum.PUBLIC, true), ApiSecurity({}));
