import type { PermissionCodeEnum } from '@acme-libs/kernel';

import type { IRoleListReconstitute, IRoleListSnapshot } from '../interfaces';

export class RoleListModel {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly permissionCodes: readonly PermissionCodeEnum[],
  ) {}

  public static toViewData(records: IRoleListReconstitute[]): IRoleListSnapshot[] {
    return records.map((record) => {
      const role = RoleListModel.reconstitute(record);

      return role.toSnapshot();
    });
  }

  private static reconstitute(record: IRoleListReconstitute): RoleListModel {
    const { id, name, rolePermissions } = record;
    const permissionCodes = rolePermissions.map((rolePermission) => rolePermission.code).sort();

    return new RoleListModel(id, name, permissionCodes);
  }

  private toSnapshot(): IRoleListSnapshot {
    return { id: this.id, name: this.name, permissionCodes: this.permissionCodes };
  }
}
