export default {
  category: 'apps:features:unit:infrastructure:queue',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/queue/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@acme-<app>/features/<unit>/outbound/**',
    '@acme-<app>/features/<unit>/infrastructure/queue',
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
