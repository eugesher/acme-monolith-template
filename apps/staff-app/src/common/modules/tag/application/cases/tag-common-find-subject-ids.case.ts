import { Inject, Injectable } from '@nestjs/common';

import type { ITagCommonFindSubjectIdsCommand } from '@acme-staff/contracts/tag';

import {
  TAG_COMMON_FIND_SUBJECT_IDS_REPOSITORY_PORT,
  type ITagCommonFindSubjectIdsRepositoryPort,
} from '../../outbound';

@Injectable()
export class TagCommonFindSubjectIdsCase {
  constructor(
    @Inject(TAG_COMMON_FIND_SUBJECT_IDS_REPOSITORY_PORT)
    private readonly repository: ITagCommonFindSubjectIdsRepositoryPort,
  ) {}

  public async execute(command: ITagCommonFindSubjectIdsCommand): Promise<string[]> {
    const { subjectType, tagId } = command;
    const subjectTagRecords = await this.repository.findByTag({ subjectType, tagId });

    return subjectTagRecords.map((record) => record.subjectId);
  }
}
