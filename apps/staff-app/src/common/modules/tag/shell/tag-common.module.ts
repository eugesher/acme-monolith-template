import { Module, type ClassProvider } from '@nestjs/common';

import { TAG_COMMON_PORT, type ITagCommonPort } from '@acme-staff/contracts/tag';

import {
  TagCommonFindCase,
  TagCommonFindSubjectIdsCase,
  TagCommonReplaceCase,
} from '../application';
import {
  TagCommonFindRepository,
  TagCommonFindSubjectIdsRepository,
  TagCommonReplaceRepository,
  TagCommonTransactionAdapter,
} from '../infrastructure';
import { TagCommonFacade } from './tag-common.facade';

@Module({
  exports: [TAG_COMMON_PORT],
  providers: [
    { provide: TAG_COMMON_PORT, useClass: TagCommonFacade } satisfies ClassProvider<ITagCommonPort>,
    TagCommonFindSubjectIdsCase,
    TagCommonFindCase,
    TagCommonReplaceCase,
    TagCommonFindRepository.PROVIDER,
    TagCommonFindSubjectIdsRepository.PROVIDER,
    TagCommonReplaceRepository.PROVIDER,
    TagCommonTransactionAdapter.PROVIDER,
  ],
})
export class TagCommonModule {}
