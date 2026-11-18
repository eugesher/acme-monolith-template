import type { ObjectLiteral, QueryDeepPartialEntity, Repository } from 'typeorm';

import type { IHostedInsertedRow } from './hosted-inserted-row.interface';

export interface IHostedRepository<Entity extends ObjectLiteral> extends Pick<
  Repository<Entity>,
  'createQueryBuilder' | 'delete' | 'existsBy' | 'insert' | 'softDelete' | 'update'
> {
  insertOne(entity: QueryDeepPartialEntity<Entity>): Promise<string>;
  insertReturning(entities: QueryDeepPartialEntity<Entity>[]): Promise<IHostedInsertedRow[]>;
}
