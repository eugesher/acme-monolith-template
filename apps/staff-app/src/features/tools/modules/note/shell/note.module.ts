import { Module } from '@nestjs/common';

import {
  NoteAccessService,
  NoteCreateCase,
  NoteDeleteCase,
  NoteGetDetailsCase,
  NoteGetListCase,
  NoteGetRevisionsCase,
  NoteResolveCase,
  NoteUpdateCase,
  NoteWriteService,
} from '../application';
import {
  NoteAccessRepository,
  NoteConfigOccRetryAttemptsProvider,
  NoteCreateRepository,
  NoteDeleteRepository,
  NoteGetListRepository,
  NoteGetRevisionsRepository,
  NoteResolveRepository,
  NoteTransactionAdapter,
  NoteUpdateRepository,
} from '../infrastructure';
import { NoteController } from './note.controller';

@Module({
  controllers: [NoteController],
  providers: [
    NoteCreateCase,
    NoteGetListCase,
    NoteGetDetailsCase,
    NoteUpdateCase,
    NoteResolveCase,
    NoteGetRevisionsCase,
    NoteDeleteCase,
    NoteAccessService,
    NoteWriteService,
    NoteAccessRepository.PROVIDER,
    NoteCreateRepository.PROVIDER,
    NoteDeleteRepository.PROVIDER,
    NoteUpdateRepository.PROVIDER,
    NoteGetListRepository.PROVIDER,
    NoteGetRevisionsRepository.PROVIDER,
    NoteResolveRepository.PROVIDER,
    NoteTransactionAdapter.PROVIDER,
    NoteConfigOccRetryAttemptsProvider,
  ],
})
export class NoteModule {}
