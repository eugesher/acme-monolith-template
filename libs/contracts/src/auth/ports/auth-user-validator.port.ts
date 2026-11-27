import type { Nullable } from '@acme-libs/toolkit';

import type { IAuthAccessTokenCommand, IAuthCurrentUserView } from '../types';

export interface IAuthUserValidatorPort {
  validateSubject(command: IAuthAccessTokenCommand): Promise<Nullable<IAuthCurrentUserView>>;
}

export const AUTH_USER_VALIDATOR_PORT = Symbol('AUTH_USER_VALIDATOR_PORT');
