import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { NoteEditModel, type INoteReconstitute } from '../../../domain';
import { NoteWriteService } from '../note-write.service';
import type { NoteAccessService } from '../note-access.service';

describe('NoteWriteService', () => {
  let accessService: jest.Mocked<Pick<NoteAccessService, 'loadOwned'>>;
  let save: jest.Mock;
  let logger: PinoLoggerMock;
  let service: NoteWriteService;

  beforeEach(() => {
    accessService = { loadOwned: jest.fn() };
    accessService.loadOwned
      .mockImplementationOnce(
        (_command: unknown, reconstitute: (record: INoteReconstitute) => unknown) =>
          Promise.resolve(
            reconstitute({
              id: '7',
              subjectType: 'product',
              subjectId: '42',
              body: 'Check the supplier',
              authorId: 'admin-1',
              resolved: false,
              version: 3,
              createdAt: new Date('2026-01-01T00:00:00.000Z'),
              updatedAt: new Date('2026-01-01T00:00:00.000Z'),
            }),
          ),
      )
      .mockImplementation(
        (_command: unknown, reconstitute: (record: INoteReconstitute) => unknown) =>
          Promise.resolve(
            reconstitute({
              id: '7',
              subjectType: 'product',
              subjectId: '42',
              body: 'Supplier confirmed',
              authorId: 'admin-1',
              resolved: false,
              version: 4,
              createdAt: new Date('2026-01-01T00:00:00.000Z'),
              updatedAt: new Date('2026-01-03T00:00:00.000Z'),
            }),
          ),
      );
    save = jest.fn().mockResolvedValue(true);
    logger = makePinoLoggerMock();
    service = new NoteWriteService(accessService as unknown as NoteAccessService, 5, logger);
  });

  describe('write', () => {
    it('saves the change against the version as read and answers the stored note with the answer of the change', async () => {
      const written = await service.write(
        { noteId: '7', authorId: 'admin-1', expectedVersion: undefined },
        NoteEditModel.reconstitute,
        (note) => note.edit('Supplier confirmed'),
        save,
      );

      const [[saveCommand]] = save.mock.calls as [[{ note: NoteEditModel; versionAsRead: number }]];

      expect(accessService.loadOwned).toHaveBeenNthCalledWith(
        1,
        { noteId: '7', authorId: 'admin-1' },
        NoteEditModel.reconstitute,
      );
      expect(saveCommand.versionAsRead).toBe(3);
      expect(saveCommand.note.toSnapshot()).toMatchObject({
        body: 'Supplier confirmed',
        version: 4,
      });
      expect(accessService.loadOwned).toHaveBeenNthCalledWith(
        2,
        { noteId: '7', authorId: 'admin-1' },
        NoteEditModel.reconstitute,
      );
      expect(written.note.toSnapshot().updatedAt).toBe('2026-01-03T00:00:00.000Z');
      expect(written.answer).toBe(true);
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('saves nothing when the change leaves the version as read', async () => {
      const written = await service.write(
        { noteId: '7', authorId: 'admin-1', expectedVersion: 3 },
        NoteEditModel.reconstitute,
        (note) => note.edit('Check the supplier'),
        save,
      );

      expect(save).not.toHaveBeenCalled();
      expect(accessService.loadOwned).toHaveBeenCalledTimes(1);
      expect(written.note.version).toBe(3);
      expect(written.answer).toBe(false);
    });

    it('retries a lost race with a fresh read and logs the retry', async () => {
      save.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      const written = await service.write(
        { noteId: '7', authorId: 'admin-1', expectedVersion: undefined },
        NoteEditModel.reconstitute,
        (note) => note.edit('Supplier called back'),
        save,
      );

      expect(save).toHaveBeenCalledTimes(2);
      expect(accessService.loadOwned).toHaveBeenCalledTimes(4);
      expect(written.note.version).toBe(4);
      expect(logger.info).toHaveBeenCalledWith(
        { id: '7', version: 4, attempt: 1, maxAttempts: 5 },
        'Note write conflict — retrying with a fresh read',
      );
    });

    it('refuses with VERSION_CONFLICT once the budget is spent and logs a warning', async () => {
      save.mockResolvedValue(false);

      await expect(
        service.write(
          { noteId: '7', authorId: 'admin-1', expectedVersion: undefined },
          NoteEditModel.reconstitute,
          (note) => note.edit('Supplier called back'),
          save,
        ),
      ).rejects.toMatchObject({
        code: 'VERSION_CONFLICT',
        message: 'Note 7 write lost the optimistic race after 5 attempts',
        details: { currentVersion: 4 },
      });
      expect(save).toHaveBeenCalledTimes(5);
      expect(logger.warn).toHaveBeenCalledWith(
        { id: '7', attempts: 5, maxAttempts: 5 },
        'Note write conflict exhausted retry budget',
      );
    });

    it('makes one attempt when the caller pinned a version and refuses a lost race with VERSION_MISMATCH', async () => {
      save.mockResolvedValue(false);

      await expect(
        service.write(
          { noteId: '7', authorId: 'admin-1', expectedVersion: 3 },
          NoteEditModel.reconstitute,
          (note) => note.edit('Supplier called back'),
          save,
        ),
      ).rejects.toMatchObject({
        code: 'VERSION_MISMATCH',
        message: 'Note 7: If-Match version 3 does not match the current version 4',
        details: { currentVersion: 4 },
      });
      expect(save).toHaveBeenCalledTimes(1);
    });

    it('refuses a pinned version that is not the current one before changing anything', async () => {
      const mutate = jest.fn();

      await expect(
        service.write(
          { noteId: '7', authorId: 'admin-1', expectedVersion: 2 },
          NoteEditModel.reconstitute,
          mutate,
          save,
        ),
      ).rejects.toMatchObject({ code: 'VERSION_MISMATCH', details: { currentVersion: 3 } });
      expect(mutate).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
    });

    it('does not retry a domain refusal', async () => {
      await expect(
        service.write(
          { noteId: '7', authorId: 'admin-1', expectedVersion: undefined },
          NoteEditModel.reconstitute,
          (note) => note.edit('   '),
          save,
        ),
      ).rejects.toMatchObject({ code: 'NOTE_BODY_INVALID' });
      expect(accessService.loadOwned).toHaveBeenCalledTimes(1);
    });
  });
});
