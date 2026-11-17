import type { PermissionCodeEnum } from '@acme-libs/kernel';

import type {
  IRoleCandidateCreate,
  IRoleCandidateInsertQuery,
  IRoleCandidateRolePermission,
  IRoleCreateLoggerPayload,
  IRoleSnapshot,
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

  public toInsertQuery(): IRoleCandidateInsertQuery {
    return { name: this.name };
  }

  public getRolePermissions(roleId: string): IRoleCandidateRolePermission[] {
    return this.permissionCodes.map((code) => ({ roleId, code }));
  }

  public toSnapshot(id: string): IRoleSnapshot {
    return { id, name: this.name, permissionCodes: [...this.permissionCodes] };
  }

  public toLoggerPayload(id: string): IRoleCreateLoggerPayload {
    return { id };
  }
}
