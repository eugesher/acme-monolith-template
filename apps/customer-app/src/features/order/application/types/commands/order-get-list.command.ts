import type { Maybe } from '@acme-libs/toolkit';

export interface IOrderGetListCommand {
  customerId: string;
  page: Maybe<number>;
  limit: Maybe<number>;
}
