import type { Nullable } from '@acme-libs/toolkit';

import type {
  IStaffAuthCommonFindSubjectCommand,
  IStaffAuthCommonSubjectView,
} from '../interfaces';

export interface IStaffAuthCommonPort {
  handleFindSubject(
    command: IStaffAuthCommonFindSubjectCommand,
  ): Promise<Nullable<IStaffAuthCommonSubjectView>>;
}

export const STAFF_AUTH_COMMON_PORT = Symbol('STAFF_AUTH_COMMON_PORT');
