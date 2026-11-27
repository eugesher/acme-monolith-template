import { Inject, Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  IAuthCommonFindSubjectCommand,
  IAuthCommonSubjectView,
} from '@acme-staff/contracts/auth';

import { AuthCommonSubjectModel } from '../../domain';
import {
  AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT,
  type IAuthCommonFindSubjectRepositoryPort,
} from '../../outbound';

@Injectable()
export class AuthCommonFindSubjectCase {
  constructor(
    @Inject(AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT)
    private readonly repository: IAuthCommonFindSubjectRepositoryPort,
  ) {}

  public async execute(
    command: IAuthCommonFindSubjectCommand,
  ): Promise<Nullable<IAuthCommonSubjectView>> {
    const { userId } = command;
    const userRecord = await this.repository.findActiveOne(userId);

    if (!userRecord) {
      return null;
    }

    const subject = AuthCommonSubjectModel.reconstitute(userRecord);

    return subject.toSnapshot();
  }
}
