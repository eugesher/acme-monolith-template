import { Repository, type ObjectLiteral, type QueryDeepPartialEntity } from 'typeorm';

import type { IHostedInsertedRow, IHostedRepository } from '@acme-libs/contracts/database';

export class HostedRepository<Entity extends ObjectLiteral>
  extends Repository<Entity>
  implements IHostedRepository<Entity>
{
  public async insertOne(entity: QueryDeepPartialEntity<Entity>): Promise<string> {
    const insertResult = await this.insert(entity);
    const [identifier] = insertResult.identifiers as { id: number | string }[];

    return String(identifier.id);
  }

  public async insertReturning(
    entities: QueryDeepPartialEntity<Entity>[],
  ): Promise<IHostedInsertedRow[]> {
    if (entities.length === 0) {
      return [];
    }

    const insertResult = await this.insert(entities);
    const generatedRows = insertResult.generatedMaps as { id: number | string; createdAt: Date }[];

    return generatedRows.map((row) => ({ id: String(row.id), createdAt: row.createdAt }));
  }
}
