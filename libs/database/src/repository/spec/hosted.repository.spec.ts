import type { EntityManager } from 'typeorm';

import { HostedRepository } from '../hosted.repository';

describe('HostedRepository', () => {
  class Item {
    public id: string;
    public name: string;
  }

  let repository: HostedRepository<Item>;
  let insert: jest.SpyInstance;

  beforeEach(() => {
    repository = new HostedRepository(Item, {} as EntityManager);
    insert = jest.spyOn(repository, 'insert');
  });

  describe('insertOne', () => {
    it('inserts the row and answers its generated id as a string', async () => {
      insert.mockResolvedValue({ identifiers: [{ id: 12 }] });

      const id = await repository.insertOne({ name: 'Lamp' });

      expect(id).toBe('12');
      expect(insert).toHaveBeenCalledWith({ name: 'Lamp' });
    });

    it('keeps an id the driver already answered as a string', async () => {
      insert.mockResolvedValue({
        identifiers: [{ id: '9007199254740993' }],
      });

      const id = await repository.insertOne({ name: 'Lamp' });

      expect(id).toBe('9007199254740993');
    });
  });

  describe('insertReturning', () => {
    it('inserts the rows and answers the id of each as a string with its creation time', async () => {
      insert.mockResolvedValue({
        generatedMaps: [
          { id: 12, createdAt: new Date('2026-01-05T08:00:00.000Z') },
          { id: '9007199254740993', createdAt: new Date('2026-01-05T08:00:01.000Z') },
        ],
      });

      const insertedRows = await repository.insertReturning([{ name: 'Lamp' }, { name: 'Desk' }]);

      expect(insertedRows).toEqual([
        { id: '12', createdAt: new Date('2026-01-05T08:00:00.000Z') },
        { id: '9007199254740993', createdAt: new Date('2026-01-05T08:00:01.000Z') },
      ]);
      expect(insert).toHaveBeenCalledWith([{ name: 'Lamp' }, { name: 'Desk' }]);
    });

    it('answers no rows and sends no statement for an empty list', async () => {
      const insertedRows = await repository.insertReturning([]);

      expect(insertedRows).toEqual([]);
      expect(insert).not.toHaveBeenCalled();
    });
  });
});
