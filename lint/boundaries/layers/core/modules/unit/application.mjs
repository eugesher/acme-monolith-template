export const coreModulesUnitApplication = {
  category: 'core:modules:unit:application',
  pattern: 'core/modules/src/*/application/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/domain',
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/modules/<unit>/application',
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/observability',
    '@nestjs/common',
    'nestjs-pino',
  ],
};
