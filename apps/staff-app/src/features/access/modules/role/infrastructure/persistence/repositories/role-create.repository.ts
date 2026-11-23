import { Injectable, type ClassProvider } from '@nestjs/common';

import { MysqlErrorHelper } from '@acme-libs/toolkit';

import {
  ROLE_CREATE_REPOSITORY_PORT,
  RoleCreateStaffRoleInsertOutcomeEnum,
  type IRoleCreateRepositoryPort,
  type IRoleCreateRolePermissionInsertQuery,
  type IRoleCreateStaffRoleInsertQuery,
  type IRoleCreateStaffRoleInsertRecord,
} from '../../../outbound';
import { RolePersistenceHost } from '../host/role-persistence.host';

@Injectable()
export class RoleCreateRepository extends RolePersistenceHost implements IRoleCreateRepositoryPort {
  public static readonly PROVIDER: ClassProvider<IRoleCreateRepositoryPort> = {
    provide: ROLE_CREATE_REPOSITORY_PORT,
    useClass: RoleCreateRepository,
  };

  public async insertRole(
    query: IRoleCreateStaffRoleInsertQuery,
  ): Promise<IRoleCreateStaffRoleInsertRecord> {
    const roleId = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.staffRoleRepository.insertOne(query),
    );

    if (roleId === null) {
      return { outcome: RoleCreateStaffRoleInsertOutcomeEnum.DUPLICATE };
    }

    return { outcome: RoleCreateStaffRoleInsertOutcomeEnum.INSERTED, id: roleId };
  }

  public async insertRolePermissions(
    queries: IRoleCreateRolePermissionInsertQuery[],
  ): Promise<void> {
    if (queries.length === 0) {
      return;
    }

    await this.staffRolePermissionRepository.insert(queries);
  }
}
