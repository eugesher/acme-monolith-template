import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  PRODUCT_ACCESS_REPOSITORY_PORT,
  type IProductAccessRepositoryPort,
} from '../../../outbound';
import { ProductBaseRepository } from './base/product-base.repository';

@Injectable()
export class ProductAccessRepository
  extends ProductBaseRepository
  implements IProductAccessRepositoryPort
{
  public static readonly provider: ClassProvider<IProductAccessRepositoryPort> = {
    provide: PRODUCT_ACCESS_REPOSITORY_PORT,
    useClass: ProductAccessRepository,
  };
}
