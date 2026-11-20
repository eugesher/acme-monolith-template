import { Inject, Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  IStaffAuthCommonFindSubjectCommand,
  IStaffAuthCommonSubjectView,
} from '@acme-staff/contracts/staff-auth';

import { StaffAuthCommonSubjectModel } from '../../domain';
import {
  STAFF_AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT,
  type IStaffAuthCommonFindSubjectRepositoryPort,
} from '../../outbound';

@Injectable()
export class StaffAuthCommonFindSubjectUseCase {
  constructor(
    @Inject(STAFF_AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT)
    private readonly repository: IStaffAuthCommonFindSubjectRepositoryPort,
  ) {}

  public async execute(
    command: IStaffAuthCommonFindSubjectCommand,
  ): Promise<Nullable<IStaffAuthCommonSubjectView>> {
    const { userId } = command;
    const userRecord = await this.repository.findActiveById(userId);

    if (!userRecord) {
      return null;
    }

    const subject = StaffAuthCommonSubjectModel.reconstitute(userRecord);

    return subject.toSnapshot();
  }
}
