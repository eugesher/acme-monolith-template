import type { IProductStatusArchiveCommand, IProductStatusArchiveView } from '../types';

export interface IProductStatusPort {
  archive(command: IProductStatusArchiveCommand): Promise<IProductStatusArchiveView>;
}

export const PRODUCT_STATUS_PORT = Symbol('PRODUCT_STATUS_PORT');
