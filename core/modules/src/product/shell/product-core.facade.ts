import { Injectable } from '@nestjs/common';

import type {
  IProductCoreArchiveCommand,
  IProductCoreArchiveView,
  IProductCorePort,
} from '@acme-core/contracts/product';

import { ProductCoreArchiveCase } from '../application';

@Injectable()
export class ProductCoreFacade implements IProductCorePort {
  constructor(private readonly archiveCase: ProductCoreArchiveCase) {}

  public async archive(command: IProductCoreArchiveCommand): Promise<IProductCoreArchiveView> {
    return await this.archiveCase.execute(command);
  }
}
