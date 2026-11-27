export const coreModulesUnitInfrastructureCache = {
  category: 'core:modules:unit:infrastructure:cache',
  pattern: 'core/modules/src/*/infrastructure/cache/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/modules/<unit>/infrastructure/cache',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/cache',
    '@nestjs/common',
  ],
};
