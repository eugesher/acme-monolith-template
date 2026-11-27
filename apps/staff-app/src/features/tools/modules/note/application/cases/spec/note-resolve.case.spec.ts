import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { NoteAccessService } from '../../services/note-access.service';
import { NoteWriteService } from '../../services/note-write.service';
import { NoteResolveCase } from '../note-resolve.case';
import type { INoteAccessRepositoryPort, INoteResolveRepositoryPort } from '../../../outbound';

describe('NoteResolveCase', () => {
  let accessRepository: jest.Mocked<INoteAccessRepositoryPort>;
  let repository: jest.Mocked<INoteResolveRepositoryPort>;
  let logger: PinoLoggerMock;
  let resolveCase: NoteResolveCase;

  beforeEach(() => {
    accessRepository = { findOwned: jest.fn() };
    accessRepository.findOwned
      .mockImplementationOnce(() =>
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
      )
      .mockImplementation(() =>
        Promise.resolve({
          id: '7',
          subjectType: 'product',
          subjectId: '42',
          body: 'Check the supplier',
          authorId: 'admin-1',
          resolved: true,
          version: 3,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-03T00:00:00.000Z'),
        }),
      );
    repository = { update: jest.fn() };
    repository.update.mockResolvedValue(true);
    logger = makePinoLoggerMock();

    const accessService = new NoteAccessService(accessRepository);

    resolveCase = new NoteResolveCase(
      new NoteWriteService(accessService, 3, logger),
      repository,
      logger,
    );
  });

  describe('execute', () => {
    it('saves the resolved note against the version as read and answers the stored note', async () => {
      const view = await resolveCase.execute({
        noteId: '7',
        authorId: 'admin-1',
        expectedVersion: undefined,
      });
      const [command] = repository.update.mock.calls[0];

      expect(command.versionAsRead).toBe(2);
      expect(command.resolved).toBe(true);
      expect(command.version).toBe(3);
      expect(view.resolved).toBe(true);
      expect(view.version).toBe(3);
      expect(view.updatedAt).toBe('2026-01-03T00:00:00.000Z');
      expect(logger.info).toHaveBeenCalledWith({ id: '7', version: 3 }, 'Note resolved');
    });

    it('retries a lost race with a fresh read', async () => {
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

      await resolveCase.execute({ noteId: '7', authorId: 'admin-1', expectedVersion: undefined });

      expect(repository.update).toHaveBeenCalledTimes(2);
      expect(logger.info).toHaveBeenCalledWith(
        { id: '7', version: 2, attempt: 1, maxAttempts: 3 },
        'Note write conflict — retrying with a fresh read',
      );
    });

    it('refuses a stale If-Match with VERSION_MISMATCH and writes nothing', async () => {
      await expect(
        resolveCase.execute({ noteId: '7', authorId: 'admin-1', expectedVersion: 1 }),
      ).rejects.toMatchObject({ code: 'VERSION_MISMATCH', details: { currentVersion: 2 } });
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('refuses a resolved note with NOTE_RESOLVED and writes nothing', async () => {
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
        resolveCase.execute({ noteId: '7', authorId: 'admin-1', expectedVersion: undefined }),
      ).rejects.toMatchObject({
        code: 'NOTE_RESOLVED',
      });
      expect(repository.update).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
