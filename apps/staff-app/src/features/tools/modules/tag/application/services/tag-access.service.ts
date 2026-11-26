import { Inject, Injectable } from '@nestjs/common';

import { TagNotFoundException } from '../../domain';
import {
  TAG_ACCESS_REPOSITORY_PORT,
  type ITagAccessRecord,
  type ITagAccessRepositoryPort,
} from '../../outbound';
import type { ITagAccessLoadCommand } from '../types';

@Injectable()
export class TagAccessService {
  constructor(
    @Inject(TAG_ACCESS_REPOSITORY_PORT)
    private readonly repository: ITagAccessRepositoryPort,
  ) {}

  public async load<TTag>(
    command: ITagAccessLoadCommand,
    reconstitute: (record: ITagAccessRecord) => TTag,
  ): Promise<TTag> {
    const { tagId } = command;
    const tagRecord = await this.repository.findOne(tagId);

    if (!tagRecord) {
      throw new TagNotFoundException(tagId);
    }

    return reconstitute(tagRecord);
  }
}
