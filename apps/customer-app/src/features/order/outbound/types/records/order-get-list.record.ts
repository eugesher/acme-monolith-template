import type { Order } from '@acme-core/entities';

export type IOrderGetListRecordItem = Pick<Order, 'id' | 'createdAt'>;

export type IOrderGetListRecord = [IOrderGetListRecordItem[], number];
