import { Module } from '@nestjs/common';

import {
  NoteAccessService,
  NoteCreateUseCase,
  NoteDeleteUseCase,
  NoteGetManyUseCase,
  NoteGetOneUseCase,
  NoteGetRevisionsUseCase,
  NoteResolveUseCase,
  NoteUpdateUseCase,
  NoteWriteService,
} from '../application';
import {
  NoteAccessRepository,
  NoteConfigOccRetryAttemptsProvider,
  NoteCreateRepository,
  NoteDeleteRepository,
  NoteGetManyRepository,
  NoteGetRevisionsRepository,
  NoteResolveRepository,
  NoteTransactionAdapter,
  NoteUpdateRepository,
} from '../infrastructure';
import { NoteController } from './note.controller';

@Module({
  controllers: [NoteController],
  providers: [
    NoteCreateUseCase,
    NoteGetManyUseCase,
    NoteGetOneUseCase,
    NoteUpdateUseCase,
    NoteResolveUseCase,
    NoteGetRevisionsUseCase,
    NoteDeleteUseCase,
    NoteAccessService,
    NoteWriteService,
    NoteAccessRepository.PROVIDER,
    NoteCreateRepository.PROVIDER,
    NoteDeleteRepository.PROVIDER,
    NoteUpdateRepository.PROVIDER,
    NoteGetManyRepository.PROVIDER,
    NoteGetRevisionsRepository.PROVIDER,
    NoteResolveRepository.PROVIDER,
    NoteTransactionAdapter.PROVIDER,
    NoteConfigOccRetryAttemptsProvider,
  ],
})
export class NoteModule {}
