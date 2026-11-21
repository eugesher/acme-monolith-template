import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT,
  type IAuthCommonFindSubjectRepositoryPort,
  type IAuthCommonFindSubjectStaffUserRecord,
} from '../../../outbound';
import { AuthCommonPersistenceHost } from '../host/auth-common-persistence.host';

@Injectable()
export class AuthCommonFindSubjectRepository
  extends AuthCommonPersistenceHost
  implements IAuthCommonFindSubjectRepositoryPort
{
  public static readonly provider: ClassProvider<IAuthCommonFindSubjectRepositoryPort> = {
    provide: AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT,
    useClass: AuthCommonFindSubjectRepository,
  };

  public async findActiveById(
    id: string,
  ): Promise<Nullable<IAuthCommonFindSubjectStaffUserRecord>> {
    return await this.createStaffUserBuilder().forActiveById(id).getOne();
  }
}
