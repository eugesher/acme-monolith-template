import { Module } from '@nestjs/common';

import {
  NoteAccessService,
  NoteCreateUseCase,
  NoteDeleteUseCase,
  NoteEditUseCase,
  NoteGetManyUseCase,
  NoteGetOneUseCase,
  NoteGetRevisionsUseCase,
  NoteResolveUseCase,
  NoteWriteService,
} from '../application';
import {
  NoteAccessRepository,
  NoteConfigOccRetryAttemptsProvider,
  NoteCreateRepository,
  NoteDeleteRepository,
  NoteEditRepository,
  NoteGetManyRepository,
  NoteGetRevisionsRepository,
  NoteResolveRepository,
  NoteTransactionAdapter,
} from '../infrastructure';
import { NoteController } from './note.controller';

@Module({
  controllers: [NoteController],
  providers: [
    NoteCreateUseCase,
    NoteGetManyUseCase,
    NoteGetOneUseCase,
    NoteEditUseCase,
    NoteResolveUseCase,
    NoteGetRevisionsUseCase,
    NoteDeleteUseCase,
    NoteAccessService,
    NoteWriteService,
    NoteAccessRepository.PROVIDER,
    NoteCreateRepository.PROVIDER,
    NoteDeleteRepository.PROVIDER,
    NoteEditRepository.PROVIDER,
    NoteGetManyRepository.PROVIDER,
    NoteGetRevisionsRepository.PROVIDER,
    NoteResolveRepository.PROVIDER,
    NoteTransactionAdapter.PROVIDER,
    NoteConfigOccRetryAttemptsProvider,
  ],
})
export class NoteModule {}
