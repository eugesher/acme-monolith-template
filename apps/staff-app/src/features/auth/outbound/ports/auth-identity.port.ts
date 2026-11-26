import type { Nullable } from '@acme-libs/toolkit';

import type { IAuthIdentityFindSubjectCommand, IAuthIdentitySubjectView } from '../types';

export interface IAuthIdentityPort {
  findSubject(
    command: IAuthIdentityFindSubjectCommand,
  ): Promise<Nullable<IAuthIdentitySubjectView>>;
}

export const AUTH_IDENTITY_PORT = Symbol('AUTH_IDENTITY_PORT');
