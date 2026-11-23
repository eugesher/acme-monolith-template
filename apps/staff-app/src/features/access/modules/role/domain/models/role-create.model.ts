import { RoleAggregate } from '../aggregates/role.aggregate';
import type { IRoleCreateLoggerPayload, IRoleCreateReconstitute } from '../types';

export class RoleCreateModel extends RoleAggregate {
  public static reconstitute(record: IRoleCreateReconstitute): RoleCreateModel {
    const { id, name, permissionCodes } = record;

    return new RoleCreateModel(id, name, permissionCodes);
  }

  public toLoggerPayload(): IRoleCreateLoggerPayload {
    return { id: this.id };
  }
}
