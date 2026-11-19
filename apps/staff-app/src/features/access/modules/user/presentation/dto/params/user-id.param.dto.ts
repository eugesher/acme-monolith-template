import { IsEntityId } from '@acme-libs/http';

export class UserIdParamDto {
  @IsEntityId({ example: '4' })
  public userId: string;
}
