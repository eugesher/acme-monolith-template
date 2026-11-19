import { IsEntityId } from '@acme-libs/http';

export class NoteIdParamDto {
  @IsEntityId({ example: '17' })
  public noteId: string;
}
