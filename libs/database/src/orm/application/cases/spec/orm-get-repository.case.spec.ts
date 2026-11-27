import { Repository, type EntityManager, type QueryRunner } from 'typeorm';

import { HostedRepository } from '../../../../repository/hosted.repository';
import { OrmGetRepositoryCase } from '../orm-get-repository.case';
import type { IOrmHostPort } from '../../../outbound';

describe('OrmGetRepositoryCase', () => {
  class Item {}

  let host: jest.Mocked<IOrmHostPort>;
  let getRepositoryCase: OrmGetRepositoryCase;

  beforeEach(() => {
    host = { getRepository: jest.fn() };
    getRepositoryCase = new OrmGetRepositoryCase(host);
  });

  it('answers a hosted repository over the repository of the host', () => {
    const manager = { name: 'manager' } as unknown as EntityManager;
    const queryRunner = { name: 'runner' } as unknown as QueryRunner;
    const repository = new Repository(Item, manager, queryRunner);
    host.getRepository.mockReturnValue(repository);

    const result = getRepositoryCase.execute(Item);

    expect(result).toBeInstanceOf(HostedRepository);
    expect(result).toMatchObject({ target: Item, manager, queryRunner });
    expect(host.getRepository).toHaveBeenCalledWith(Item);
  });
});
