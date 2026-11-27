export const coreModulesUnitApplication = {
  category: 'core:modules:unit:application',
  pattern: 'core/modules/src/*/application/**',
  capture: ['unit'],
  allow: [
    '@nestjs/common',
    'nestjs-pino',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/observability',
    '@acme-libs/toolkit',
    '@acme-core/contracts/<unit>',

    '@acme-core/modules/<unit>/domain',
    '@acme-core/modules/<unit>/outbound/**',

    '@acme-core/modules/<unit>/application',
  ],
};
