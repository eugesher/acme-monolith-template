import { Entity } from '@acme-libs/domain';

import { TagNameInvalidException } from '../errors';
import type { ITagSnapshot } from '../interfaces';

export abstract class TagAggregate extends Entity {
  private static readonly NAME_MAX_LENGTH = 64;

  protected constructor(
    id: string,
    protected _name: string,
    protected readonly createdAt: Date,
    protected readonly updatedAt: Date,
  ) {
    super(id);
  }

  public toSnapshot(): ITagSnapshot {
    return {
      id: this.id,
      name: this._name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  protected static validName(name: string): string {
    const trimmedName = name.trim();

    if (trimmedName.length === 0 || trimmedName.length > TagAggregate.NAME_MAX_LENGTH) {
      throw new TagNameInvalidException(TagAggregate.NAME_MAX_LENGTH);
    }

    return trimmedName;
  }
}
