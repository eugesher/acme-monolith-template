import { VersionedEntity } from '@acme-libs/domain';
import type { ProductStatusEnum } from '@acme-libs/kernel';
import type { Maybe } from '@acme-libs/toolkit';

import {
  ProductNameInvalidException,
  ProductSkuInvalidException,
  ProductVersionInvalidException,
  ProductVersionMismatchException,
} from '../errors';
import type { IProductReconstitute, IProductSnapshot, IProductUpdatePayload } from '../types';

export abstract class ProductAggregate extends VersionedEntity {
  protected name: string;
  protected status: ProductStatusEnum;
  protected readonly sku: string;
  protected readonly createdAt: Date;
  protected readonly updatedAt: Date;

  private static readonly SKU_PATTERN = /^[A-Z0-9][A-Z0-9-]{2,63}$/;
  private static readonly NAME_MAX_LENGTH = 255;

  protected constructor(record: IProductReconstitute) {
    const { id, sku, name, status, version, createdAt, updatedAt } = record;
    const validVersion = ProductAggregate.validVersion(version);

    super(id, validVersion);

    this.sku = ProductAggregate.validSku(sku);
    this.name = ProductAggregate.validName(name);
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public assertExpectedVersion(expectedVersion: Maybe<number>): void {
    if (this.isExpectedVersion(expectedVersion)) {
      return;
    }

    throw new ProductVersionMismatchException(this.id, expectedVersion, this.version);
  }

  public toUpdatePayload(versionAsRead: number): IProductUpdatePayload {
    return {
      id: this.id,
      versionAsRead,
      name: this.name,
      status: this.status,
      version: this.version,
    };
  }

  public toSnapshot(): IProductSnapshot {
    return {
      id: this.id,
      sku: this.sku,
      name: this.name,
      status: this.status,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  protected static validSku(sku: string): string {
    if (!ProductAggregate.SKU_PATTERN.test(sku)) {
      throw new ProductSkuInvalidException(ProductAggregate.SKU_PATTERN, sku);
    }

    return sku;
  }

  protected static validName(name: string): string {
    const trimmedName = name.trim();

    if (trimmedName.length === 0 || trimmedName.length > ProductAggregate.NAME_MAX_LENGTH) {
      throw new ProductNameInvalidException(ProductAggregate.NAME_MAX_LENGTH);
    }

    return trimmedName;
  }

  private static validVersion(version: number): number {
    if (!VersionedEntity.isValidVersion(version)) {
      throw new ProductVersionInvalidException(version);
    }

    return version;
  }
}
