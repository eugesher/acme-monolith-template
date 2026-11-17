import { ProductStatusEnum } from '@acme-libs/kernel';

import type {
  IProductCoreArchiveLedgerPayload,
  IProductCoreReconstitute,
  IProductCoreUpdatePayload,
} from '../interfaces';

export class ProductCoreModel {
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
    public readonly id: string,
    public readonly sku: string,
    private currentStatus: ProductStatusEnum,
    private currentVersion: number,
  ) {}

  public static reconstitute(record: IProductCoreReconstitute): ProductCoreModel {
    const { id, sku, status, version } = record;

    return new ProductCoreModel(id, sku, status, version);
  }

  public archive(): void {
    if (this.isArchived) {
      return;
    }

    this.currentStatus = ProductStatusEnum.ARCHIVED;
    this.currentVersion += 1;
  }

  public toUpdatePayload(versionAsRead: number): IProductCoreUpdatePayload {
    return { id: this.id, versionAsRead, status: this.status, version: this.version };
  }

  public toArchiveLedgerPayload(
    previousStatus: ProductStatusEnum,
  ): IProductCoreArchiveLedgerPayload {
    return {
      subjectId: this.id,
      version: this.version,
      payload: { sku: this.sku, previousStatus },
    };
  }
}
