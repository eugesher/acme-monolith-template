export default {
  category: 'acme-app:processors:infrastructure:queue',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/infrastructure/queue/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/processors/<module>/outbound/**',
    '@acme-<app>/processors/<module>/infrastructure/queue',
    '@acme-<app>/processors/<module>/queues',
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
