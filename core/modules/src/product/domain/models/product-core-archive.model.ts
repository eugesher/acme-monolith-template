import { VersionedEntity } from '@acme-libs/domain';
import { ProductStatusEnum } from '@acme-libs/kernel';

import type {
  IProductCoreArchiveLedgerPayload,
  IProductCoreArchiveReconstitute,
  IProductCoreArchiveUpdatePayload,
} from '../interfaces';

export class ProductCoreArchiveModel extends VersionedEntity {
  public get status(): ProductStatusEnum {
    return this.currentStatus;
  }

  public get isArchived(): boolean {
    return this.currentStatus === ProductStatusEnum.ARCHIVED;
  }

  private constructor(
    id: string,
    private readonly sku: string,
    private currentStatus: ProductStatusEnum,
    version: number,
    private readonly updatedAt: Date,
  ) {
    super(id, version);
  }

  public static reconstitute(record: IProductCoreArchiveReconstitute): ProductCoreArchiveModel {
    const { id, sku, status, version, updatedAt } = record;

    return new ProductCoreArchiveModel(id, sku, status, version, updatedAt);
  }

  public archive(): void {
    if (this.isArchived) {
      return;
    }

    this.currentStatus = ProductStatusEnum.ARCHIVED;
    this.bumpVersion();
  }

  public toUpdatePayload(versionAsRead: number): IProductCoreArchiveUpdatePayload {
    return { id: this.id, versionAsRead, status: this.status, version: this.version };
  }

  public toLedgerPayload(previousStatus: ProductStatusEnum): IProductCoreArchiveLedgerPayload {
    return {
      subjectId: this.id,
      version: this.version,
      occurredAt: this.updatedAt.toISOString(),
      payload: { sku: this.sku, previousStatus },
    };
  }
}
