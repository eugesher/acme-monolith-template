import { Entity } from '@acme-libs/domain';
import type { PermissionCodeEnum } from '@acme-libs/kernel';

import type { IRoleSnapshot } from '../interfaces';

export abstract class RoleAggregate extends Entity {
  protected constructor(
    id: string,
    protected readonly name: string,
    protected permissionCodes: readonly PermissionCodeEnum[],
  ) {
    super(id);
  }

  public toSnapshot(): IRoleSnapshot {
    return { id: this.id, name: this.name, permissionCodes: this.permissionCodes };
  }
}
