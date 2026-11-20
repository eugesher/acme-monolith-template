import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  STAFF_AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT,
  type IStaffAuthCommonFindSubjectRepositoryPort,
  type IStaffAuthCommonFindSubjectStaffUserRecord,
} from '../../../outbound';
import { StaffAuthCommonPersistenceHost } from '../host/staff-auth-common-persistence.host';

@Injectable()
export class StaffAuthCommonFindSubjectRepository
  extends StaffAuthCommonPersistenceHost
  implements IStaffAuthCommonFindSubjectRepositoryPort
{
  public static readonly provider: ClassProvider<IStaffAuthCommonFindSubjectRepositoryPort> = {
    provide: STAFF_AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT,
    useClass: StaffAuthCommonFindSubjectRepository,
  };

  public async findActiveById(
    id: string,
  ): Promise<Nullable<IStaffAuthCommonFindSubjectStaffUserRecord>> {
    return await this.createStaffUserBuilder().forActiveById(id).getOne();
  }
}
