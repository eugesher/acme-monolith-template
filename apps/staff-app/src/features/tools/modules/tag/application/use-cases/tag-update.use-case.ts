import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { TagNameTakenException, TagUpdateModel } from '../../domain';
import {
  TAG_UPDATE_REPOSITORY_PORT,
  TagUpdateOutcomeEnum,
  type ITagUpdateRepositoryPort,
} from '../../outbound';
import { TagAccessService } from '../services/tag-access.service';
import type { ITagUpdateCommand, ITagView } from '../types';

@Injectable()
export class TagUpdateUseCase {
  constructor(
    private readonly accessService: TagAccessService,
    @Inject(TAG_UPDATE_REPOSITORY_PORT)
    private readonly repository: ITagUpdateRepositoryPort,
    @InjectPinoLogger(TagUpdateUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: ITagUpdateCommand): Promise<ITagView> {
    const { tagId, name } = command;
    const tag = await this.accessService.load({ tagId }, TagUpdateModel.reconstitute);
    const nameAsRead = tag.name;

    tag.update(name);

    if (tag.name === nameAsRead) {
      return tag.toSnapshot();
    }

    await this.update(tag);

    const updated = await this.accessService.load({ tagId }, TagUpdateModel.reconstitute);

    const tagLoggerPayload = updated.toLoggerPayload();

    this.logger.info(tagLoggerPayload, 'Tag updated');

    return updated.toSnapshot();
  }

  private async update(tag: TagUpdateModel): Promise<void> {
    const tagUpdatePayload = tag.toUpdatePayload();
    const updateOutcome = await this.repository.update(tagUpdatePayload);

    if (updateOutcome === TagUpdateOutcomeEnum.DUPLICATE) {
      throw new TagNameTakenException(tagUpdatePayload.name);
    }
  }
}
