import { ProductStockExceptionCodeEnum } from '../codes/product-stock-exception-code.enum';
import { ProductStockBaseException } from './base/product-stock-base.exception';

export class ProductStockProductNotFoundException extends ProductStockBaseException {
  public readonly code = ProductStockExceptionCodeEnum.PRODUCT_STOCK_PRODUCT_NOT_FOUND;

  constructor(productId: string, message = `Product ${productId} was not found`) {
    super(message);
  }
}
