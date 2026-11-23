import { Module } from '@nestjs/common';

import {
  TagAccessService,
  TagCreateUseCase,
  TagDeleteUseCase,
  TagGetManyUseCase,
  TagRenameUseCase,
} from '../application';
import {
  TagAccessRepository,
  TagCreateRepository,
  TagDeleteRepository,
  TagGetManyRepository,
  TagRenameRepository,
} from '../infrastructure';
import { TagController } from './tag.controller';

@Module({
  controllers: [TagController],
  providers: [
    TagCreateUseCase,
    TagDeleteUseCase,
    TagGetManyUseCase,
    TagRenameUseCase,
    TagAccessService,
    TagAccessRepository.PROVIDER,
    TagCreateRepository.PROVIDER,
    TagDeleteRepository.PROVIDER,
    TagGetManyRepository.PROVIDER,
    TagRenameRepository.PROVIDER,
  ],
})
export class TagModule {}
