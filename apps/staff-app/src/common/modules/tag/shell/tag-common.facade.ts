import { Injectable } from '@nestjs/common';

import type {
  ITagCommonFindCommand,
  ITagCommonFindSubjectIdsCommand,
  ITagCommonPort,
  ITagCommonReplaceCommand,
  ITagCommonReplaceView,
  ITagCommonTagView,
} from '@acme-staff/contracts/tag';

import {
  TagCommonFindCase,
  TagCommonFindSubjectIdsCase,
  TagCommonReplaceCase,
} from '../application';

@Injectable()
export class TagCommonFacade implements ITagCommonPort {
  constructor(
    private readonly findCase: TagCommonFindCase,
    private readonly findSubjectIdsCase: TagCommonFindSubjectIdsCase,
    private readonly replaceCase: TagCommonReplaceCase,
  ) {}

  public async find(command: ITagCommonFindCommand): Promise<ITagCommonTagView[]> {
    return await this.findCase.execute(command);
  }

  public async replace(command: ITagCommonReplaceCommand): Promise<ITagCommonReplaceView> {
    return await this.replaceCase.execute(command);
  }

  public async findSubjectIds(command: ITagCommonFindSubjectIdsCommand): Promise<string[]> {
    return await this.findSubjectIdsCase.execute(command);
  }
}
