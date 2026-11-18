import { Injectable, type ClassProvider } from '@nestjs/common';

import {
  TAG_GET_MANY_REPOSITORY_PORT,
  type ITagGetManyQuery,
  type ITagGetManyRecord,
  type ITagGetManyRepositoryPort,
} from '../../../outbound';
import { TagPersistenceHost } from '../host/tag-persistence.host';

@Injectable()
export class TagGetManyRepository extends TagPersistenceHost implements ITagGetManyRepositoryPort {
  public static readonly provider: ClassProvider<ITagGetManyRepositoryPort> = {
    provide: TAG_GET_MANY_REPOSITORY_PORT,
    useClass: TagGetManyRepository,
  };

  public async list(query: ITagGetManyQuery): Promise<ITagGetManyRecord> {
    return await this.createTagBuilder().forList(query).getManyAndCount();
  }
}
