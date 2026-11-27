import { Injectable } from '@nestjs/common';

import { ProductGetOneModel } from '../../domain';
import { ProductAccessService } from '../services/product-access.service';
import type { IProductGetOneCommand, IProductView } from '../types';

@Injectable()
export class ProductGetOneCase {
  constructor(private readonly accessService: ProductAccessService) {}

  public async execute(command: IProductGetOneCommand): Promise<IProductView> {
    const { productId } = command;
    const product = await this.accessService.load({ productId }, ProductGetOneModel.reconstitute);

    return product.toSnapshot();
  }
}
