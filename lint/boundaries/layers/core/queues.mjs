export const coreQueues = {
  category: 'core:queues',
  pattern: 'core/queues/src/**',
  capture: [],
  allow: ['@nestjs/common', '@acme-libs/kernel', '@acme-libs/queue', '@acme-core/queues'],
};
