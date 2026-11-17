import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { TagModel, TagNameTakenException, type ITagCandidate } from '../../domain';
import {
  TAG_CREATE_REPOSITORY_PORT,
  TagCreateInsertOutcomeEnum,
  type ITagCreateRepositoryPort,
} from '../../outbound';
import type { ITagCreateCommand, ITagView } from '../interfaces';

@Injectable()
export class TagCreateUseCase {
  constructor(
    @Inject(TAG_CREATE_REPOSITORY_PORT)
    private readonly repository: ITagCreateRepositoryPort,
    @InjectPinoLogger(TagCreateUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: ITagCreateCommand): Promise<ITagView> {
    const { name } = command;
    const tagCandidate = TagModel.initCandidate({ name });
    const tagId = await this.insert(tagCandidate);
    const tagRecord = await this.repository.findInserted(tagId);
    const createdTag = TagModel.reconstitute(tagRecord);
    const tagLoggerPayload = createdTag.toCreateLoggerPayload();

    this.logger.info(tagLoggerPayload, 'Tag created');

    return createdTag.toSnapshot();
  }

  private async insert(candidate: ITagCandidate): Promise<string> {
    const insertResult = await this.repository.insert(candidate);

    if (insertResult.outcome === TagCreateInsertOutcomeEnum.DUPLICATE) {
      throw new TagNameTakenException(candidate.name);
    }

    return insertResult.id;
  }
}
