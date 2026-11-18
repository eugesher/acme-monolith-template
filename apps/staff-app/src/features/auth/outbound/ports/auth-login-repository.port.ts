import type { Nullable } from '@acme-libs/toolkit';

import type { IAuthLoginStaffUserRecord } from '../interfaces';

export interface IAuthLoginRepositoryPort {
  findByEmail(email: string): Promise<Nullable<IAuthLoginStaffUserRecord>>;
}

export const AUTH_LOGIN_REPOSITORY_PORT = Symbol('AUTH_LOGIN_REPOSITORY_PORT');
