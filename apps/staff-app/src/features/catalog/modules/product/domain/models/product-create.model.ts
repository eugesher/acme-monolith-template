import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductAggregate } from '../aggregates/product.aggregate';
import type {
  IProductCreateCandidate,
  IProductCreateCandidateInit,
  IProductCreateLedgerPayload,
  IProductCreateLoggerPayload,
  IProductReconstitute,
} from '../types';

export class ProductCreateModel extends ProductAggregate {
  public static initCandidate(proposal: IProductCreateCandidateInit): IProductCreateCandidate {
    const { sku, name } = proposal;
    const validSku = ProductCreateModel.validSku(sku);
    const validName = ProductCreateModel.validName(name);

    return { sku: validSku, name: validName, status: ProductStatusEnum.DRAFT, version: 1 };
  }

  public static reconstitute(this: void, record: IProductReconstitute): ProductCreateModel {
    return new ProductCreateModel(record);
  }

  public toLedgerPayload(): IProductCreateLedgerPayload {
    return {
      subjectId: this.id,
      occurredAt: this.createdAt.toISOString(),
      payload: { sku: this.sku, name: this.name },
    };
  }

  public toLoggerPayload(): IProductCreateLoggerPayload {
    return { id: this.id, sku: this.sku };
  }
}
