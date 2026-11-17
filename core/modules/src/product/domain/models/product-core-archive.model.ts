import { ProductStatusEnum } from '@acme-libs/kernel';

import type {
  IProductCoreArchiveLedgerPayload,
  IProductCoreArchiveReconstitute,
  IProductCoreArchiveUpdatePayload,
} from '../interfaces';

export class ProductCoreArchiveModel {
  public get status(): ProductStatusEnum {
    return this.currentStatus;
  }

  public get version(): number {
    return this.currentVersion;
  }

  public get isArchived(): boolean {
    return this.currentStatus === ProductStatusEnum.ARCHIVED;
  }

  private constructor(
    private readonly id: string,
    private readonly sku: string,
    private currentStatus: ProductStatusEnum,
    private currentVersion: number,
  ) {}

  public static reconstitute(record: IProductCoreArchiveReconstitute): ProductCoreArchiveModel {
    const { id, sku, status, version } = record;

    return new ProductCoreArchiveModel(id, sku, status, version);
  }

  public archive(): void {
    if (this.isArchived) {
      return;
    }

    this.currentStatus = ProductStatusEnum.ARCHIVED;
    this.currentVersion += 1;
  }

  public toUpdatePayload(versionAsRead: number): IProductCoreArchiveUpdatePayload {
    return { id: this.id, versionAsRead, status: this.status, version: this.version };
  }

  public toLedgerPayload(previousStatus: ProductStatusEnum): IProductCoreArchiveLedgerPayload {
    return {
      subjectId: this.id,
      version: this.version,
      payload: { sku: this.sku, previousStatus },
    };
  }
}
