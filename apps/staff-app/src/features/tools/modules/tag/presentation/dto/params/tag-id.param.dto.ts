import { IsEntityId } from '@acme-libs/http';

export class TagIdParamDto {
  @IsEntityId({ example: '300' })
  public tagId: string;
}
