import { Module } from '@nestjs/common';

import {
  TagAccessService,
  TagCreateUseCase,
  TagDeleteUseCase,
  TagGetManyUseCase,
  TagUpdateUseCase,
} from '../application';
import {
  TagAccessRepository,
  TagCreateRepository,
  TagDeleteRepository,
  TagGetManyRepository,
  TagUpdateRepository,
} from '../infrastructure';
import { TagController } from './tag.controller';

@Module({
  controllers: [TagController],
  providers: [
    TagCreateUseCase,
    TagDeleteUseCase,
    TagGetManyUseCase,
    TagUpdateUseCase,
    TagAccessService,
    TagAccessRepository.PROVIDER,
    TagCreateRepository.PROVIDER,
    TagDeleteRepository.PROVIDER,
    TagGetManyRepository.PROVIDER,
    TagUpdateRepository.PROVIDER,
  ],
})
export class TagModule {}
