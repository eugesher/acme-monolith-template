import { IsEntityId } from '@acme-libs/http';

export class ProductStockProductIdParamDto {
  @IsEntityId({ example: '12' })
  public productId: string;
}
