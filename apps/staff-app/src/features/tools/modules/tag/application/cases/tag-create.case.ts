import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { TagCreateModel, TagNameTakenException, type ITagCreateCandidate } from '../../domain';
import {
  TAG_CREATE_REPOSITORY_PORT,
  TagCreateInsertOutcomeEnum,
  type ITagCreateRepositoryPort,
} from '../../outbound';
import type { ITagCreateCommand, ITagView } from '../types';

@Injectable()
export class TagCreateCase {
  constructor(
    @Inject(TAG_CREATE_REPOSITORY_PORT)
    private readonly repository: ITagCreateRepositoryPort,
    @InjectPinoLogger(TagCreateCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: ITagCreateCommand): Promise<ITagView> {
    const { name } = command;
    const tagCandidate = TagCreateModel.initCandidate({ name });
    const tagId = await this.insert(tagCandidate);
    const tagRecord = await this.repository.findInserted(tagId);
    const createdTag = TagCreateModel.reconstitute(tagRecord);
    const tagLoggerPayload = createdTag.toLoggerPayload();

    this.logger.info(tagLoggerPayload, 'Tag created');

    return createdTag.toSnapshot();
  }

  private async insert(candidate: ITagCreateCandidate): Promise<string> {
    const insertResult = await this.repository.insert(candidate);

    if (insertResult.outcome === TagCreateInsertOutcomeEnum.DUPLICATE) {
      throw new TagNameTakenException(candidate.name);
    }

    return insertResult.id;
  }
}
