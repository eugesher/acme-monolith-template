import { packages } from './selectors.mjs';

export const queue = [
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
      'a processor only takes Processor, WorkerHost and OnWorkerEvent from @nestjs/bullmq and the Job type from bullmq; queues are registered in common/shared',
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
      'a queue adapter only takes InjectQueue from @nestjs/bullmq and the Queue type from bullmq; queues are registered in common/shared',
  },
];
