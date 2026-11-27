export const coreModulesUnitInfrastructureCache = {
  category: 'core:modules:unit:infrastructure:cache',
  pattern: 'core/modules/src/*/infrastructure/cache/**',
  capture: ['unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/cache',

    '@acme-core/modules/<unit>/outbound/**',

    '@acme-core/modules/<unit>/infrastructure/cache',
  ],
};
