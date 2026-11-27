import { Injectable } from '@nestjs/common';

import type { Nullable } from '@acme-libs/toolkit';
import type {
  IAuthCommonFindSubjectCommand,
  IAuthCommonPort,
  IAuthCommonSubjectView,
} from '@acme-staff/contracts/auth';

import { AuthCommonFindSubjectCase } from '../application';

@Injectable()
export class AuthCommonFacade implements IAuthCommonPort {
  constructor(private readonly findSubjectCase: AuthCommonFindSubjectCase) {}

  public async findSubject(
    command: IAuthCommonFindSubjectCommand,
  ): Promise<Nullable<IAuthCommonSubjectView>> {
    return await this.findSubjectCase.execute(command);
  }
}
