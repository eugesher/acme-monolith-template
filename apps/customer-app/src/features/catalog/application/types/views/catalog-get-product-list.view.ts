import type { IPage } from '@acme-libs/toolkit';

export type ICatalogGetProductListView = IPage<{
  id: string;
  sku: string;
  name: string;
}>;
