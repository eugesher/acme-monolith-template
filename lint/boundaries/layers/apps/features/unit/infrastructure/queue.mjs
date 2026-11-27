export const appsFeaturesUnitInfrastructureQueue = {
  category: 'apps:features:unit:infrastructure:queue',
  pattern: 'apps/*/src/features/{*,*/modules/*}/infrastructure/queue/**',
  capture: ['app', 'unit', '', '', '', 'file'],
  allow: [
    '@nestjs/bullmq',
    '@nestjs/common',
    'bullmq',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/queues',

    '@acme-<app>/features/<unit>/outbound/**',

    '@acme-<app>/features/<unit>/infrastructure/queue',
  ],
};
