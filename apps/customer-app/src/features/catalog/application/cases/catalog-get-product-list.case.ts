import { Inject, Injectable } from '@nestjs/common';

import { PaginationHelper, type IPageWindow } from '@acme-libs/toolkit';

import { CatalogGetProductListModel } from '../../domain';
import {
  CATALOG_CACHE_PORT,
  CATALOG_CACHE_TTL_MS_DEFAULT_TOKEN,
  CATALOG_PRODUCT_LIST_REPOSITORY_PORT,
  type ICatalogCachePort,
  type ICatalogGetProductListRepositoryPort,
} from '../../outbound';
import type { ICatalogGetProductListCommand, ICatalogGetProductListView } from '../types';

@Injectable()
export class CatalogGetProductListCase {
  constructor(
    @Inject(CATALOG_PRODUCT_LIST_REPOSITORY_PORT)
    private readonly repository: ICatalogGetProductListRepositoryPort,
    @Inject(CATALOG_CACHE_PORT)
    private readonly cache: ICatalogCachePort,
    @Inject(CATALOG_CACHE_TTL_MS_DEFAULT_TOKEN)
    private readonly cacheTtlMs: number,
  ) {}

  public async execute(
    command: ICatalogGetProductListCommand,
  ): Promise<ICatalogGetProductListView> {
    const pageWindow = PaginationHelper.clampPageWindow({ query: command });
    const { page, limit } = pageWindow;

    return await this.cache.read({
      page,
      limit,
      ttlMs: this.cacheTtlMs,
      compute: () => this.listPage(pageWindow),
    });
  }

  private async listPage(pageWindow: IPageWindow): Promise<ICatalogGetProductListView> {
    const { page, limit, offset } = pageWindow;
    const [records, total] = await this.repository.list({ limit, offset });
    const data = CatalogGetProductListModel.toViewData(records);

    return PaginationHelper.toPage({ data, page, limit, total });
  }
}
