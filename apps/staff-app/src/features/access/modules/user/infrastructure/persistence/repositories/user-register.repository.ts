import { Inject, Injectable, type ClassProvider } from '@nestjs/common';

import { MysqlErrorHelper } from '@acme-libs/toolkit';
import { ORM_PORT, type IOrmPort } from '@acme-libs/contracts/database';

import {
  USER_REGISTER_REPOSITORY_PORT,
  UserRegisterStaffUserInsertOutcomeEnum,
  type IUserRegisterRepositoryPort,
  type IUserRegisterStaffRoleRecord,
  type IUserRegisterStaffUserInsertQuery,
  type IUserRegisterStaffUserInsertRecord,
  type IUserRegisterStaffUserRoleInsertQuery,
} from '../../../outbound';
import { UserPersistenceHost } from '../host/user-persistence.host';

@Injectable()
export class UserRegisterRepository
  extends UserPersistenceHost
  implements IUserRegisterRepositoryPort
{
  public static readonly provider: ClassProvider<IUserRegisterRepositoryPort> = {
    provide: USER_REGISTER_REPOSITORY_PORT,
    useClass: UserRegisterRepository,
  };

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {
    super();
  }

  public async insertUser(
    query: IUserRegisterStaffUserInsertQuery,
  ): Promise<IUserRegisterStaffUserInsertRecord> {
    const userId = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.staffUserRepository.insertOne(query),
    );

    if (userId === null) {
      return { outcome: UserRegisterStaffUserInsertOutcomeEnum.DUPLICATE };
    }

    return { outcome: UserRegisterStaffUserInsertOutcomeEnum.INSERTED, id: userId };
  }

  public async findRoles(ids: readonly string[]): Promise<IUserRegisterStaffRoleRecord[]> {
    if (ids.length === 0) {
      return [];
    }

    return await this.createStaffRoleBuilder().forByIds(ids).getMany();
  }

  public async insertUserRoles(queries: IUserRegisterStaffUserRoleInsertQuery[]): Promise<void> {
    if (queries.length === 0) {
      return;
    }

    await this.staffUserRoleRepository.insert(queries);
  }
}
