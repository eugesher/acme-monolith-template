import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  PRODUCT_WRITE_REPOSITORY_PORT,
  type IProductWriteRepositoryPort,
  type IProductWriteUpdateQuery,
} from '../../../outbound';
import { ProductBaseRepository } from './base/product-base.repository';

@Injectable()
export class ProductWriteRepository
  extends ProductBaseRepository
  implements IProductWriteRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IProductWriteRepositoryPort> = {
    provide: PRODUCT_WRITE_REPOSITORY_PORT,
    useClass: ProductWriteRepository,
  };

  public async update(query: IProductWriteUpdateQuery): Promise<boolean> {
    const { id, versionAsRead, name, status, version } = query;
    const updateResult = await this.productRepository.update(
      { id, version: versionAsRead },
      { name, status, version },
    );

    return updateResult.affected === 1;
  }
}
