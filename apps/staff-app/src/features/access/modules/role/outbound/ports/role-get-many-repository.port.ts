import type { IRoleGetManyRecord } from '../types';

export interface IRoleGetManyRepositoryPort {
  list(): Promise<IRoleGetManyRecord[]>;
}

export const ROLE_LIST_REPOSITORY_PORT = Symbol('ROLE_LIST_REPOSITORY_PORT');
