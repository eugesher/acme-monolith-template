import type { Nullable } from '@acme-libs/toolkit';

import type { IAuthCommonFindSubjectCommand, IAuthCommonSubjectView } from '../types';

export interface IAuthCommonPort {
  handleFindSubject(
    command: IAuthCommonFindSubjectCommand,
  ): Promise<Nullable<IAuthCommonSubjectView>>;
}

export const AUTH_COMMON_PORT = Symbol('AUTH_COMMON_PORT');
