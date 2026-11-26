import { IsEntityId } from '@acme-libs/http';

export class ProductIdParamDto {
  @IsEntityId({ example: '12' })
  public productId: string;
}
