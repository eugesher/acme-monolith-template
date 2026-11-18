import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  STAFF_AUTH_CORE_FIND_SUBJECT_REPOSITORY_PORT,
  type IStaffAuthCoreFindSubjectRepositoryPort,
  type IStaffAuthCoreFindSubjectStaffUserRecord,
} from '../../../outbound';
import { StaffAuthCorePersistenceHost } from '../host/staff-auth-core-persistence.host';

@Injectable()
export class StaffAuthCoreFindSubjectRepository
  extends StaffAuthCorePersistenceHost
  implements IStaffAuthCoreFindSubjectRepositoryPort
{
  public static readonly provider: ClassProvider<IStaffAuthCoreFindSubjectRepositoryPort> = {
    provide: STAFF_AUTH_CORE_FIND_SUBJECT_REPOSITORY_PORT,
    useClass: StaffAuthCoreFindSubjectRepository,
  };

  public async findActiveById(
    id: string,
  ): Promise<Nullable<IStaffAuthCoreFindSubjectStaffUserRecord>> {
    return await this.createStaffUserBuilder().forActiveById(id).getOne();
  }
}
