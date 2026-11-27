import { Injectable } from '@nestjs/common';

import type {
  IProductStockCoreLockCommand,
  IProductStockCoreMoveCommand,
  IProductStockCoreMoveView,
  IProductStockCoreOnHandView,
  IProductStockCorePort,
} from '@acme-core/contracts/product-stock';

import { ProductStockCoreLockCase, ProductStockCoreMoveCase } from '../application';

@Injectable()
export class ProductStockCoreFacade implements IProductStockCorePort {
  constructor(
    private readonly lockCase: ProductStockCoreLockCase,
    private readonly moveCase: ProductStockCoreMoveCase,
  ) {}

  public async lock(command: IProductStockCoreLockCommand): Promise<IProductStockCoreOnHandView[]> {
    return await this.lockCase.execute(command);
  }

  public async move(command: IProductStockCoreMoveCommand): Promise<IProductStockCoreMoveView> {
    return await this.moveCase.execute(command);
  }
}
