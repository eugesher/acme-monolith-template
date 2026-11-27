export default {
  category: 'acme-core:modules:shell',
  pattern: 'core/modules/src/*/shell/**',
  capture: ['module'],
  allow: [
    '@acme-core/modules/<module>/application',
    '@acme-core/modules/<module>/infrastructure',
    '@acme-core/modules/<module>/shell/*.facade',
    '@acme-core/modules/<module>/shell',
    '@acme-core/contracts/<module>',
    '@acme-core/modules/*',
    '@acme-core/queues',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
