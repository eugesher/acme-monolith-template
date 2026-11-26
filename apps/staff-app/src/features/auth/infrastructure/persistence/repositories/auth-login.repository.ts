import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  AUTH_LOGIN_REPOSITORY_PORT,
  type IAuthLoginRepositoryPort,
  type IAuthLoginStaffUserRecord,
} from '../../../outbound';
import { AuthPersistenceHost } from '../host/auth-persistence.host';

@Injectable()
export class AuthLoginRepository extends AuthPersistenceHost implements IAuthLoginRepositoryPort {
  public static readonly PROVIDER: ClassProvider<IAuthLoginRepositoryPort> = {
    provide: AUTH_LOGIN_REPOSITORY_PORT,
    useClass: AuthLoginRepository,
  };

  public async findByEmail(email: string): Promise<Nullable<IAuthLoginStaffUserRecord>> {
    return await this.createStaffUserBuilder().forEmail(email).getOne();
  }
}
