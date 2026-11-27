import { Injectable } from '@nestjs/common';

import { PermissionCodeEnum } from '@acme-libs/kernel';

import type { IPermissionGetManyView } from '../types';

@Injectable()
export class PermissionGetManyCase {
  public execute(): IPermissionGetManyView {
    return { codes: Object.values(PermissionCodeEnum) };
  }
}
