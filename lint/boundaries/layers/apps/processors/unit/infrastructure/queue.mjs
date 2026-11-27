export const appsProcessorsUnitInfrastructureQueue = {
  category: 'apps:processors:unit:infrastructure:queue',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/queue/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@acme-<app>/processors/<unit>/outbound/**',
    '@acme-<app>/processors/<unit>/infrastructure/queue',
    '@acme-<app>/processors/<unit>/queues',
    '@acme-<app>/contracts',
    '@acme-core/contracts',
    '@acme-core/queues',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/bullmq',
    '@nestjs/common',
    'bullmq',
  ],
};
