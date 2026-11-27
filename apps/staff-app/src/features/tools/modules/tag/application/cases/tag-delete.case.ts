import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { TagDeleteModel } from '../../domain';
import { TAG_DELETE_REPOSITORY_PORT, type ITagDeleteRepositoryPort } from '../../outbound';
import { TagAccessService } from '../services/tag-access.service';
import type { ITagDeleteCommand } from '../types';

@Injectable()
export class TagDeleteCase {
  constructor(
    private readonly accessService: TagAccessService,
    @Inject(TAG_DELETE_REPOSITORY_PORT)
    private readonly repository: ITagDeleteRepositoryPort,
    @InjectPinoLogger(TagDeleteCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: ITagDeleteCommand): Promise<void> {
    const { tagId } = command;

    const tag = await this.accessService.load({ tagId }, TagDeleteModel.reconstitute);
    await this.repository.delete(tagId);

    const tagLoggerPayload = tag.toLoggerPayload();

    this.logger.info(tagLoggerPayload, 'Tag deleted');
  }
}
