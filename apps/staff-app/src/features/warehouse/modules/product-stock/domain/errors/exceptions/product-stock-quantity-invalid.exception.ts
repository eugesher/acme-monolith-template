import { ProductStockExceptionCodeEnum } from '../codes/product-stock-exception-code.enum';
import { ProductStockBaseException } from './base/product-stock-base.exception';

export class ProductStockQuantityInvalidException extends ProductStockBaseException {
  public readonly code = ProductStockExceptionCodeEnum.PRODUCT_STOCK_QUANTITY_INVALID;

  constructor(
    maxQuantity: number,
    quantity: number,
    message = `Product restock quantity must be an integer from 1 to ${maxQuantity}, got ${quantity}`,
  ) {
    super(message);
  }
}
