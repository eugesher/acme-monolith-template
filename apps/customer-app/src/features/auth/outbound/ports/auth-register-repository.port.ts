import type { IAuthRegisterCustomerInsertQuery, IAuthRegisterCustomerInsertRecord } from '../types';

export interface IAuthRegisterRepositoryPort {
  insert(query: IAuthRegisterCustomerInsertQuery): Promise<IAuthRegisterCustomerInsertRecord>;
}

export const AUTH_REGISTER_REPOSITORY_PORT = Symbol('AUTH_REGISTER_REPOSITORY_PORT');
