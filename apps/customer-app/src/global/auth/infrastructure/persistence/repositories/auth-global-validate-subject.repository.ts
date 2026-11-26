import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  AUTH_GLOBAL_VALIDATE_SUBJECT_REPOSITORY_PORT,
  type IAuthGlobalValidateSubjectCustomerRecord,
  type IAuthGlobalValidateSubjectRepositoryPort,
} from '../../../outbound';
import { AuthGlobalPersistenceHost } from '../host/auth-global-persistence.host';

@Injectable()
export class AuthGlobalValidateSubjectRepository
  extends AuthGlobalPersistenceHost
  implements IAuthGlobalValidateSubjectRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IAuthGlobalValidateSubjectRepositoryPort> = {
    provide: AUTH_GLOBAL_VALIDATE_SUBJECT_REPOSITORY_PORT,
    useClass: AuthGlobalValidateSubjectRepository,
  };

  public async findActiveOne(
    id: string,
  ): Promise<Nullable<IAuthGlobalValidateSubjectCustomerRecord>> {
    return await this.createCustomerBuilder().forActiveOne(id).getOne();
  }
}
