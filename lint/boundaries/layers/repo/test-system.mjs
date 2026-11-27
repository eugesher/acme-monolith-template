export const repoTestSystem = {
  category: 'repo:test:system',
  pattern: 'test/system/**',
  capture: [],
  allow: [
    '@nestjs/bullmq',
    '@nestjs/common',
    'bullmq',
    'ioredis',
    'supertest',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/testing',
    '@acme-libs/toolkit',
    '@acme-core/queues',
    '@acme-core/contracts',
    '@acme-*/app',

    'test/system/**',
  ],
};
