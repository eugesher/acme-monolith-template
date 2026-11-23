import type { Nullable } from '@acme-libs/toolkit';

import type { IAuthLoginCustomerRecord } from '../types';

export interface IAuthLoginRepositoryPort {
  findByEmail(email: string): Promise<Nullable<IAuthLoginCustomerRecord>>;
}

export const AUTH_LOGIN_REPOSITORY_PORT = Symbol('AUTH_LOGIN_REPOSITORY_PORT');
