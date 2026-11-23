import { Injectable, type ClassProvider } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';

import {
  AUTH_LOGIN_REPOSITORY_PORT,
  type IAuthLoginCustomerRecord,
  type IAuthLoginRepositoryPort,
} from '../../../outbound';
import { AuthPersistenceHost } from '../host/auth-persistence.host';

@Injectable()
export class AuthLoginRepository extends AuthPersistenceHost implements IAuthLoginRepositoryPort {
  public static readonly PROVIDER: ClassProvider<IAuthLoginRepositoryPort> = {
    provide: AUTH_LOGIN_REPOSITORY_PORT,
    useClass: AuthLoginRepository,
  };

  public async findByEmail(email: string): Promise<Nullable<IAuthLoginCustomerRecord>> {
    return await this.createCustomerBuilder().forByEmail(email).getOne();
  }
}
