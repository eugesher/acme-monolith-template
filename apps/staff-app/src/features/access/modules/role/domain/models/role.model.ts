import type { PermissionCodeEnum } from '@acme-libs/kernel';

import type {
  IRoleCandidate,
  IRoleCandidateInit,
  IRoleReconstitute,
  IRoleSnapshot,
} from '../interfaces';

export class RoleModel {
  public get permissionCodes(): readonly PermissionCodeEnum[] {
    return this.codes;
  }

  private constructor(
    public readonly id: string,
    public readonly name: string,
    private codes: PermissionCodeEnum[],
  ) {}

  public static reconstitute(record: IRoleReconstitute): RoleModel {
    const { id, name, rolePermissions } = record;
    const permissionCodes = rolePermissions.map((rolePermission) => rolePermission.code).sort();

    return new RoleModel(id, name, permissionCodes);
  }

  public static initCandidate(proposal: IRoleCandidateInit): IRoleCandidate {
    const { name, permissionCodes } = proposal;

    return { name, permissionCodes: [...new Set(permissionCodes)] };
  }

  public reassignPermissions(requested: PermissionCodeEnum[]): void {
    this.codes = [...new Set(requested)];
  }

  public toSnapshot(): IRoleSnapshot {
    return { id: this.id, name: this.name, permissionCodes: [...this.permissionCodes] };
  }
}
