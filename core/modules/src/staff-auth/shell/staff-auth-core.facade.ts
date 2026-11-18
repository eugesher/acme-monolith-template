import { Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  IStaffAuthCoreFindSubjectCommand,
  IStaffAuthCorePort,
  IStaffAuthCoreSubjectView,
} from '@acme-core/contracts/staff-auth';

import { StaffAuthCoreFindSubjectUseCase } from '../application';

@Injectable()
export class StaffAuthCoreFacade implements IStaffAuthCorePort {
  constructor(private readonly findSubject: StaffAuthCoreFindSubjectUseCase) {}

  public async handleFindSubject(
    command: IStaffAuthCoreFindSubjectCommand,
  ): Promise<Nullable<IStaffAuthCoreSubjectView>> {
    return await this.findSubject.execute(command);
  }
}
