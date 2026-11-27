export const coreModulesUnitInfrastructureQueue = {
  category: 'core:modules:unit:infrastructure:queue',
  pattern: 'core/modules/src/*/infrastructure/queue/**',
  capture: ['unit'],
  allow: [
    '@nestjs/bullmq',
    '@nestjs/common',
    'bullmq',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/queues',
    '@acme-core/contracts/<unit>',

    '@acme-core/modules/<unit>/outbound/**',

    '@acme-core/modules/<unit>/infrastructure/queue',
  ],
};
