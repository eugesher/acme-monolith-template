import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { NoteCreateUseCase } from '../note-create.use-case';
import type { INoteCreateCandidate } from '../../../domain';
import type { INoteCreateRepositoryPort } from '../../../outbound';

describe('NoteCreateUseCase', () => {
  let repository: jest.Mocked<INoteCreateRepositoryPort>;
  let logger: PinoLoggerMock;
  let useCase: NoteCreateUseCase;

  beforeEach(() => {
    repository = { insert: jest.fn(), findInserted: jest.fn() };
    repository.insert.mockResolvedValue('7');
    repository.findInserted.mockResolvedValue({
      id: '7',
      subjectType: 'product',
      subjectId: '42',
      body: 'Check the supplier',
      authorId: 'admin-1',
      resolved: false,
      version: 1,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    logger = makePinoLoggerMock();
    useCase = new NoteCreateUseCase(repository, logger);
  });

  describe('execute', () => {
    it('stores an unresolved note and answers the stored note', async () => {
      const view = await useCase.execute({
        subjectType: 'product',
        subjectId: ' 42 ',
        body: ' Check the supplier ',
        authorId: 'admin-1',
      });
      const [note] = repository.insert.mock.calls[0] as [INoteCreateCandidate];

      expect(note.subjectId).toBe('42');
      expect(note.body).toBe('Check the supplier');
      expect(note.resolved).toBe(false);
      expect(note.version).toBe(1);
      expect(view).toEqual({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 1,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      });
      expect(logger.info).toHaveBeenCalledWith(
        { id: '7', subjectType: 'product', subjectId: '42', authorId: 'admin-1' },
        'Note created',
      );
    });

    it('refuses an invalid note before storing anything', async () => {
      await expect(
        useCase.execute({
          subjectType: 'Product',
          subjectId: '42',
          body: 'Check the supplier',
          authorId: 'admin-1',
        }),
      ).rejects.toMatchObject({ code: 'NOTE_SUBJECT_INVALID' });
      expect(repository.insert).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
