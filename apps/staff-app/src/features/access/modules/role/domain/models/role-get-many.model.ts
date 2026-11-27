import type { PermissionCodeEnum } from '@acme-libs/kernel';

import type { IRoleGetManyReconstitute, IRoleGetManySnapshot } from '../types';

export class RoleGetManyModel {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly permissionCodes: readonly PermissionCodeEnum[],
  ) {}

  public static toViewData(records: IRoleGetManyReconstitute[]): IRoleGetManySnapshot[] {
    return records.map((record) => {
      const role = RoleGetManyModel.reconstitute(record);

      return role.toSnapshot();
    });
  }

  private static reconstitute(record: IRoleGetManyReconstitute): RoleGetManyModel {
    const { id, name, rolePermissions } = record;
    const permissionCodes = rolePermissions.map((rolePermission) => rolePermission.code).sort();

    return new RoleGetManyModel(id, name, permissionCodes);
  }

  private toSnapshot(): IRoleGetManySnapshot {
    return { id: this.id, name: this.name, permissionCodes: this.permissionCodes };
  }
}
