export const appsTest = {
  category: 'apps:test',
  pattern: 'apps/*/test/**',
  capture: ['app'],
  allow: [
    '@nestjs/bullmq',
    '@nestjs/common',
    '@nestjs/config',
    'bullmq',
    'ioredis',
    'supertest',
    'typeorm',

    '@acme-libs/database',
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/observability',
    '@acme-libs/testing',
    '@acme-libs/toolkit',
    '@acme-core/entities',
    '@acme-core/queues',
    '@acme-core/contracts',
    '@acme-<app>/app',
    '@acme-<app>/common/entities',

    'apps/<app>/test/**',
  ],
};
