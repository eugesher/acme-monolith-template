import { Injectable, type ClassProvider } from '@nestjs/common';
import { In, Not } from 'typeorm';

import {
  USER_REASSIGN_ROLES_REPOSITORY_PORT,
  type IUserReassignRolesRepositoryPort,
  type IUserReassignRolesStaffRoleRecord,
  type IUserReassignRolesStaffUserRoleDeleteQuery,
  type IUserReassignRolesStaffUserRoleInsertQuery,
} from '../../../outbound';
import { UserPersistenceHost } from '../host/user-persistence.host';

@Injectable()
export class UserReassignRolesRepository
  extends UserPersistenceHost
  implements IUserReassignRolesRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IUserReassignRolesRepositoryPort> = {
    provide: USER_REASSIGN_ROLES_REPOSITORY_PORT,
    useClass: UserReassignRolesRepository,
  };

  public async existsUser(id: string): Promise<boolean> {
    return await this.staffUserRepository.existsBy({ id });
  }

  public async findMany(ids: readonly string[]): Promise<IUserReassignRolesStaffRoleRecord[]> {
    if (ids.length === 0) {
      return [];
    }

    return await this.createStaffRoleBuilder().forMany(ids).getMany();
  }

  public async deleteUserRolesExcept(
    query: IUserReassignRolesStaffUserRoleDeleteQuery,
  ): Promise<void> {
    const { userId, roleIds } = query;

    if (roleIds.length === 0) {
      await this.staffUserRoleRepository.delete({ userId });

      return;
    }

    await this.staffUserRoleRepository.delete({ userId, roleId: Not(In(roleIds)) });
  }

  public async insertUserRolesIgnore(
    queries: IUserReassignRolesStaffUserRoleInsertQuery[],
  ): Promise<void> {
    if (queries.length === 0) {
      return;
    }

    await this.staffUserRoleRepository
      .createQueryBuilder()
      .insert()
      .values(queries)
      .orIgnore()
      .execute();
  }
}
