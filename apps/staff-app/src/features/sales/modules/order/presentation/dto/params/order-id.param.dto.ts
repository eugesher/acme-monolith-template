import { IsEntityId } from '@acme-libs/http';

export class OrderIdParamDto {
  @IsEntityId({ example: '600' })
  public orderId: string;
}
