export default {
  category: 'acme-core:modules:infrastructure:queue',
  pattern: 'core/modules/src/*/infrastructure/queue/**',
  capture: ['module'],
  allow: [
    '@acme-core/modules/<module>/outbound/**',
    '@acme-core/modules/<module>/infrastructure/queue',
    '@acme-core/contracts/<module>',
    '@acme-core/queues',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/bullmq',
    '@nestjs/common',
    'bullmq',
  ],
};
