import { Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  IStaffAuthCommonFindSubjectCommand,
  IStaffAuthCommonPort,
  IStaffAuthCommonSubjectView,
} from '@acme-staff/contracts/staff-auth';

import { StaffAuthCommonFindSubjectUseCase } from '../application';

@Injectable()
export class StaffAuthCommonFacade implements IStaffAuthCommonPort {
  constructor(private readonly findSubject: StaffAuthCommonFindSubjectUseCase) {}

  public async handleFindSubject(
    command: IStaffAuthCommonFindSubjectCommand,
  ): Promise<Nullable<IStaffAuthCommonSubjectView>> {
    return await this.findSubject.execute(command);
  }
}
