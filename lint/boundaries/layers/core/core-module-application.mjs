export default {
  category: 'acme-core:modules:application',
  pattern: 'core/modules/src/*/application/**',
  capture: ['module'],
  allow: [
    '@acme-core/modules/<module>/domain',
    '@acme-core/modules/<module>/outbound/**',
    '@acme-core/modules/<module>/application',
    '@acme-core/domain',
    '@acme-core/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    '@nestjs/common',
    'nestjs-pino',
  ],
};
