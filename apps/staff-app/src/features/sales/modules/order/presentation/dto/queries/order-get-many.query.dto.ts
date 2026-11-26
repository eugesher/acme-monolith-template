import { IsEntityId, PageQueryDto } from '@acme-libs/http';

export class OrderGetManyQueryDto extends PageQueryDto {
  @IsEntityId({ example: '302', description: 'Only the orders with this tag', optional: true })
  public tagId?: string;
}
