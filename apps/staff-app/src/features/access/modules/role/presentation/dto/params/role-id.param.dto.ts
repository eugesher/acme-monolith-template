import { IsEntityId } from '@acme-libs/http';

export class RoleIdParamDto {
  @IsEntityId({ example: '2' })
  public roleId: string;
}
