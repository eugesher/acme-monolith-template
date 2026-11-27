import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  ROLE_LIST_REPOSITORY_PORT,
  type IRoleGetManyRecord,
  type IRoleGetManyRepositoryPort,
} from '../../../outbound';
import { RolePersistenceHost } from '../host/role-persistence.host';

@Injectable()
export class RoleGetManyRepository
  extends RolePersistenceHost
  implements IRoleGetManyRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IRoleGetManyRepositoryPort> = {
    provide: ROLE_LIST_REPOSITORY_PORT,
    useClass: RoleGetManyRepository,
  };

  public async list(): Promise<IRoleGetManyRecord[]> {
    return await this.createStaffRoleBuilder().forList().getMany();
  }
}
