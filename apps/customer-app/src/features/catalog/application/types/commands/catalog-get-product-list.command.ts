import type { Maybe } from '@acme-libs/toolkit';

export interface ICatalogGetProductListCommand {
  page: Maybe<number>;
  limit: Maybe<number>;
}
