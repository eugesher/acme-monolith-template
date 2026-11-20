import { CorrelationContextHelper } from '@acme-libs/observability';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { NoteAccessService } from '../../services/note-access.service';
import { NoteWriteService } from '../../services/note-write.service';
import { NoteEditUseCase } from '../note-edit.use-case';
import type {
  INoteAccessRepositoryPort,
  INoteEditRepositoryPort,
  INoteTransactionPort,
} from '../../../outbound';

describe('NoteEditUseCase', () => {
  let calls: string[];
  let accessRepository: jest.Mocked<INoteAccessRepositoryPort>;
  let repository: jest.Mocked<INoteEditRepositoryPort>;
  let transaction: jest.Mocked<INoteTransactionPort>;
  let logger: PinoLoggerMock;
  let useCase: NoteEditUseCase;

  beforeEach(() => {
    calls = [];
    accessRepository = { findOwned: jest.fn() };
    accessRepository.findOwned
      .mockImplementationOnce(() => {
        calls.push('findOwned');

        return Promise.resolve({
          id: '7',
          subjectType: 'product',
          subjectId: '42',
          body: 'Check the supplier',
          authorId: 'admin-1',
          resolved: false,
          version: 2,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        });
      })
      .mockImplementation(() => {
        calls.push('findOwned');

        return Promise.resolve({
          id: '7',
          subjectType: 'product',
          subjectId: '42',
          body: 'Supplier confirmed',
          authorId: 'admin-1',
          resolved: false,
          version: 3,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-03T00:00:00.000Z'),
        });
      });
    repository = { update: jest.fn(), appendRevision: jest.fn() };
    repository.update.mockImplementation(() => {
      calls.push('update');

      return Promise.resolve(true);
    });
    repository.appendRevision.mockImplementation(() => {
      calls.push('appendRevision');

      return Promise.resolve();
    });
    transaction = { run: jest.fn() };
    transaction.run.mockImplementation(async (work) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    logger = makePinoLoggerMock();

    const accessService = new NoteAccessService(accessRepository);

    useCase = new NoteEditUseCase(
      new NoteWriteService(accessService, 3, logger),
      repository,
      transaction,
      logger,
    );
  });

  describe('execute', () => {
    it('reads the note, saves it and appends its revision in one transaction, then answers the note read after the commit', async () => {
      const view = await CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000001', () =>
        useCase.execute({
          noteId: '7',
          body: ' Supplier confirmed ',
          editorId: 'admin-1',
          expectedVersion: undefined,
        }),
      );
      const [command] = repository.update.mock.calls[0];
      const [revision] = repository.appendRevision.mock.calls[0];

      expect(calls).toEqual([
        'findOwned',
        'begin',
        'update',
        'appendRevision',
        'commit',
        'findOwned',
      ]);
      expect(command.versionAsRead).toBe(2);
      expect(command.body).toBe('Supplier confirmed');
      expect(command.version).toBe(3);
      expect(revision).toEqual({
        noteId: '7',
        noteVersion: 3,
        bodyBefore: 'Check the supplier',
        bodyAfter: 'Supplier confirmed',
        editorId: 'admin-1',
        correlationId: 'c0ffee00-0000-4000-8000-000000000001',
      });
      expect(view).toEqual({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Supplier confirmed',
        authorId: 'admin-1',
        resolved: false,
        version: 3,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-03T00:00:00.000Z',
      });
      expect(logger.info).toHaveBeenCalledWith(
        { id: '7', authorId: 'admin-1', version: 3 },
        'Note edited',
      );
    });

    it('writes nothing and opens no transaction for an edit to the same body', async () => {
      const view = await useCase.execute({
        noteId: '7',
        body: ' Check the supplier ',
        editorId: 'admin-1',
        expectedVersion: undefined,
      });

      expect(transaction.run).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
      expect(repository.appendRevision).not.toHaveBeenCalled();
      expect(accessRepository.findOwned).toHaveBeenCalledTimes(1);
      expect(view.version).toBe(2);
      expect(logger.info).toHaveBeenCalledWith(
        { id: '7', authorId: 'admin-1', version: 2 },
        'Note edit was a no-op',
      );
    });

    it('fails the transaction when the revision cannot be appended, so the note update rolls back', async () => {
      repository.appendRevision.mockRejectedValue(new Error('deadlock'));

      await expect(
        CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000001', () =>
          useCase.execute({
            noteId: '7',
            body: 'Supplier confirmed',
            editorId: 'admin-1',
            expectedVersion: undefined,
          }),
        ),
      ).rejects.toThrow('deadlock');
      expect(calls).not.toContain('commit');
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(transaction.run).toHaveBeenCalledTimes(1);
      expect(accessRepository.findOwned).toHaveBeenCalledTimes(1);
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('appends no revision for a lost race and retries the whole edit with a fresh read', async () => {
      repository.update.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      accessRepository.findOwned.mockReset().mockImplementation(() =>
        Promise.resolve({
          id: '7',
          subjectType: 'product',
          subjectId: '42',
          body: 'Check the supplier',
          authorId: 'admin-1',
          resolved: false,
          version: 2,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      );

      await CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000001', () =>
        useCase.execute({
          noteId: '7',
          body: 'Supplier confirmed',
          editorId: 'admin-1',
          expectedVersion: undefined,
        }),
      );

      expect(transaction.run).toHaveBeenCalledTimes(2);
      expect(repository.update).toHaveBeenCalledTimes(2);
      expect(repository.appendRevision).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith(
        { id: '7', version: 2, attempt: 1, maxAttempts: 3 },
        'Note write conflict — retrying with a fresh read',
      );
    });

    it('refuses with VERSION_CONFLICT once every attempt lost the race', async () => {
      repository.update.mockResolvedValue(false);
      accessRepository.findOwned.mockReset().mockImplementation(() =>
        Promise.resolve({
          id: '7',
          subjectType: 'product',
          subjectId: '42',
          body: 'Check the supplier',
          authorId: 'admin-1',
          resolved: false,
          version: 2,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      );

      await expect(
        useCase.execute({
          noteId: '7',
          body: 'Supplier confirmed',
          editorId: 'admin-1',
          expectedVersion: undefined,
        }),
      ).rejects.toMatchObject({
        code: 'VERSION_CONFLICT',
        details: { currentVersion: 2 },
      });
      expect(repository.update).toHaveBeenCalledTimes(3);
      expect(repository.appendRevision).not.toHaveBeenCalled();
    });

    it('refuses a stale If-Match with VERSION_MISMATCH before opening a transaction', async () => {
      await expect(
        useCase.execute({
          noteId: '7',
          body: 'Supplier confirmed',
          editorId: 'admin-1',
          expectedVersion: 1,
        }),
      ).rejects.toMatchObject({ code: 'VERSION_MISMATCH', details: { currentVersion: 2 } });
      expect(transaction.run).not.toHaveBeenCalled();
    });

    it('refuses a resolved note before opening a transaction', async () => {
      accessRepository.findOwned.mockReset().mockResolvedValue({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: true,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      await expect(
        useCase.execute({
          noteId: '7',
          body: 'Supplier confirmed',
          editorId: 'admin-1',
          expectedVersion: undefined,
        }),
      ).rejects.toMatchObject({ code: 'NOTE_RESOLVED' });
      expect(transaction.run).not.toHaveBeenCalled();
    });

    it('refuses a note not found for the editor with NOTE_NOT_FOUND', async () => {
      accessRepository.findOwned.mockReset().mockResolvedValue(null);

      await expect(
        useCase.execute({
          noteId: '7',
          body: 'Supplier confirmed',
          editorId: 'admin-1',
          expectedVersion: undefined,
        }),
      ).rejects.toMatchObject({ code: 'NOTE_NOT_FOUND' });
      expect(transaction.run).not.toHaveBeenCalled();
    });
  });
});
