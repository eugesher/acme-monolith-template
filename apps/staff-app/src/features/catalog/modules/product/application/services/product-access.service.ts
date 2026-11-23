import { Inject, Injectable } from '@nestjs/common';

import { ProductNotFoundException } from '../../domain';
import {
  PRODUCT_ACCESS_REPOSITORY_PORT,
  type IProductAccessRecord,
  type IProductAccessRepositoryPort,
} from '../../outbound';
import type { IProductAccessLoadCommand } from '../types';

@Injectable()
export class ProductAccessService {
  constructor(
    @Inject(PRODUCT_ACCESS_REPOSITORY_PORT)
    private readonly repository: IProductAccessRepositoryPort,
  ) {}

  public async load<TProduct>(
    command: IProductAccessLoadCommand,
    reconstitute: (record: IProductAccessRecord) => TProduct,
  ): Promise<TProduct> {
    const productRecord = await this.find(command);

    return reconstitute(productRecord);
  }

  public async assertExists(command: IProductAccessLoadCommand): Promise<void> {
    await this.find(command);
  }

  private async find(command: IProductAccessLoadCommand): Promise<IProductAccessRecord> {
    const { productId } = command;
    const productRecord = await this.repository.findById(productId);

    if (!productRecord) {
      throw new ProductNotFoundException(productId);
    }

    return productRecord;
  }
}
