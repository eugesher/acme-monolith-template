import { packages } from './selectors.mjs';

export const queue = [
  {
    from: { file: { categories: 'acme-app:processors:presentation' } },
    disallow: [
      {
        to: { file: { categories: 'acme-app:processors:outbound' } },
        dependency: { specifiers: ['!*_QUEUE'] },
      },
    ],
    message: 'a processor takes only the queue name from the outbound of its module',
  },
  {
    from: { file: { categories: 'acme-app:processors:presentation' } },
    disallow: [
      {
        ...packages('@nestjs/bullmq'),
        dependency: { specifiers: ['!{OnWorkerEvent,Processor,WorkerHost}'] },
      },
      { ...packages('bullmq'), dependency: { specifiers: ['!Job'] } },
    ],
    message:
      'a processor only takes Processor, WorkerHost and OnWorkerEvent from @nestjs/bullmq and the Job type from bullmq; a queue is registered by the module of its queue adapter or in core/queues',
  },
  {
    from: {
      file: {
        categories: [
          'acme-app:features:infrastructure:queue',
          'acme-app:processors:infrastructure:queue',
          'acme-core:modules:infrastructure:queue',
        ],
      },
    },
    disallow: [
      { ...packages('@nestjs/bullmq'), dependency: { specifiers: ['!InjectQueue'] } },
      { ...packages('bullmq'), dependency: { specifiers: ['!Queue'] } },
    ],
    message:
      'a queue adapter only takes InjectQueue from @nestjs/bullmq and the Queue type from bullmq; a queue is registered by the module of its queue adapter or in core/queues',
  },
];
