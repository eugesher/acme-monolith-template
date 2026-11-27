export default {
  category: 'core:modules:unit:infrastructure:queue',
  pattern: 'core/modules/src/*/infrastructure/queue/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/modules/<unit>/infrastructure/queue',
    '@acme-core/contracts/<unit>',
    '@acme-core/queues',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/bullmq',
    '@nestjs/common',
    'bullmq',
  ],
};
