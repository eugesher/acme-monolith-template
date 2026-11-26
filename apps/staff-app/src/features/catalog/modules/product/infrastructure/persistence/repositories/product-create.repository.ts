import { Injectable, type ClassProvider } from '@nestjs/common';

import { MysqlErrorHelper } from '@acme-libs/toolkit';

import {
  PRODUCT_CREATE_REPOSITORY_PORT,
  ProductCreateInsertOutcomeEnum,
  type IProductCreateInsertQuery,
  type IProductCreateInsertRecord,
  type IProductCreateRecord,
  type IProductCreateRepositoryPort,
} from '../../../outbound';
import { ProductPersistenceHost } from '../host/product-persistence.host';

@Injectable()
export class ProductCreateRepository
  extends ProductPersistenceHost
  implements IProductCreateRepositoryPort
{
  public static readonly PROVIDER: ClassProvider<IProductCreateRepositoryPort> = {
    provide: PRODUCT_CREATE_REPOSITORY_PORT,
    useClass: ProductCreateRepository,
  };

  public async insert(query: IProductCreateInsertQuery): Promise<IProductCreateInsertRecord> {
    const productId = await MysqlErrorHelper.catchDuplicateKey(() =>
      this.productRepository.insertOne(query),
    );

    if (productId === null) {
      return { outcome: ProductCreateInsertOutcomeEnum.DUPLICATE };
    }

    return { outcome: ProductCreateInsertOutcomeEnum.INSERTED, id: productId };
  }

  public async findInserted(productId: string): Promise<IProductCreateRecord> {
    return await this.createProductBuilder().forOne(productId).getOneOrFail();
  }
}
