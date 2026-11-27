import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import {
  TagCommonReplaceOutcomeEnum,
  type ITagCommonReplaceCommand,
  type ITagCommonReplaceView,
} from '@acme-staff/contracts/tag';

import { TagCommonSubjectTagsReplaceModel } from '../../domain';
import {
  TAG_COMMON_REPLACE_REPOSITORY_PORT,
  TAG_COMMON_TRANSACTION_PORT,
  type ITagCommonReplaceRepositoryPort,
  type ITagCommonTransactionPort,
} from '../../outbound';

@Injectable()
export class TagCommonReplaceCase {
  constructor(
    @Inject(TAG_COMMON_REPLACE_REPOSITORY_PORT)
    private readonly repository: ITagCommonReplaceRepositoryPort,
    @Inject(TAG_COMMON_TRANSACTION_PORT)
    private readonly transaction: ITagCommonTransactionPort,
    @InjectPinoLogger(TagCommonReplaceCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: ITagCommonReplaceCommand): Promise<ITagCommonReplaceView> {
    const { subjectType, subjectId } = command;
    const replaceView = await this.transaction.run(() => this.replace(command));
    const { outcome, tags } = replaceView;

    if (outcome === TagCommonReplaceOutcomeEnum.REPLACED) {
      const replaceLoggerPayload = TagCommonSubjectTagsReplaceModel.toLoggerPayload({
        subjectType,
        subjectId,
        tags,
      });

      this.logger.info(replaceLoggerPayload, 'Subject tags replaced');
    }

    return replaceView;
  }

  private async replace(command: ITagCommonReplaceCommand): Promise<ITagCommonReplaceView> {
    const { subjectType, subjectId, tagIds } = command;
    const tags = await this.repository.lockMany(tagIds);
    const missingTagIds = TagCommonSubjectTagsReplaceModel.missingTagIds(tagIds, tags);

    if (missingTagIds.length > 0) {
      return { outcome: TagCommonReplaceOutcomeEnum.TAG_NOT_FOUND, tags: [], missingTagIds };
    }

    const subjectTagRecords = await this.repository.findLinked({ subjectType, subjectId });
    const subjectTags = TagCommonSubjectTagsReplaceModel.reconstitute({
      subjectType,
      subjectId,
      subjectTags: subjectTagRecords,
    });
    const subjectTagChanges = subjectTags.replace(tags);

    await this.repository.unlink(subjectTagChanges.unlink);
    await this.repository.link(subjectTagChanges.link);

    const tagSnapshots = TagCommonSubjectTagsReplaceModel.toSnapshots(tags);

    return { outcome: TagCommonReplaceOutcomeEnum.REPLACED, tags: tagSnapshots, missingTagIds: [] };
  }
}
