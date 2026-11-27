import { Module } from '@nestjs/common';

import {
  TagAccessService,
  TagCreateCase,
  TagDeleteCase,
  TagGetManyCase,
  TagUpdateCase,
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
    TagCreateCase,
    TagDeleteCase,
    TagGetManyCase,
    TagUpdateCase,
    TagAccessService,
    TagAccessRepository.PROVIDER,
    TagCreateRepository.PROVIDER,
    TagDeleteRepository.PROVIDER,
    TagGetManyRepository.PROVIDER,
    TagUpdateRepository.PROVIDER,
  ],
})
export class TagModule {}
