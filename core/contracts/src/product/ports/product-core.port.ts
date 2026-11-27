import type { IProductCoreArchiveCommand, IProductCoreArchiveView } from '../types';

export interface IProductCorePort {
  archive(command: IProductCoreArchiveCommand): Promise<IProductCoreArchiveView>;
}

export const PRODUCT_CORE_PORT = Symbol('PRODUCT_CORE_PORT');
