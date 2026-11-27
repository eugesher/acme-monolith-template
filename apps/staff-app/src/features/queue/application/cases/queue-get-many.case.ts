import { Inject, Injectable } from '@nestjs/common';

import { QUEUE_REGISTRY_PORT, type IQueueRegistryPort } from '../../outbound';
import type { IQueueGetManyView } from '../types';

@Injectable()
export class QueueGetManyCase {
  constructor(
    @Inject(QUEUE_REGISTRY_PORT)
    private readonly registry: IQueueRegistryPort,
  ) {}

  public async execute(): Promise<IQueueGetManyView[]> {
    return await this.registry.listJobCounts();
  }
}
