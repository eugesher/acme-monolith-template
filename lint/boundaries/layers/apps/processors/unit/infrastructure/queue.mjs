export const appsProcessorsUnitInfrastructureQueue = {
  category: 'apps:processors:unit:infrastructure:queue',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/queue/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@nestjs/bullmq',
    '@nestjs/common',
    'bullmq',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-<app>/processors/<unit>/queues',

    '@acme-<app>/processors/<unit>/infrastructure/queue',
  ],
};
