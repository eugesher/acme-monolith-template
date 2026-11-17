import type { PermissionCodeEnum } from '@acme-libs/kernel';

import type {
  IRoleCandidateCreate,
  IRoleCandidateInsertPayload,
  IRoleCandidateRolePermission,
  IRoleCreateReconstitute,
} from '../interfaces';

export class RoleCandidateModel {
  private constructor(
    private readonly name: string,
    private readonly permissionCodes: readonly PermissionCodeEnum[],
  ) {}

  public static create(proposal: IRoleCandidateCreate): RoleCandidateModel {
    const { name, permissionCodes } = proposal;

    return new RoleCandidateModel(name, [...new Set(permissionCodes)]);
  }

  public toInsertPayload(): IRoleCandidateInsertPayload {
    return { name: this.name };
  }

  public createRolePermissions(roleId: string): IRoleCandidateRolePermission[] {
    return this.permissionCodes.map((code) => ({ roleId, code }));
  }

  public toCreated(id: string): IRoleCreateReconstitute {
    return { id, name: this.name, permissionCodes: this.permissionCodes };
  }
}
