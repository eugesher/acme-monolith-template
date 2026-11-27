export default {
  category: 'acme-app:features:infrastructure:queue',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/queue/**',
  capture: ['app', 'module', 'single', 'area', 'submodule', 'file'],
  allow: [
    '@acme-<app>/features/<module>/outbound/**',
    '@acme-<app>/features/<module>/infrastructure/queue',
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
