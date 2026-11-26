import { IsEntityId, PageQueryDto } from '@acme-libs/http';

export class ProductGetManyQueryDto extends PageQueryDto {
  @IsEntityId({ example: '300', description: 'Only the products with this tag', optional: true })
  public tagId?: string;
}
