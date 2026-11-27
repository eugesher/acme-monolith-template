import type { IPage } from '@acme-libs/toolkit';

export type IOrderGetListView = IPage<{
  id: string;
  createdAt: string;
}>;
