export const coreModulesUnitInfrastructureCoreAdapters = {
  category: 'core:modules:unit:infrastructure:core-adapters',
  pattern: 'core/modules/src/*/infrastructure/core-adapters/**',
  capture: ['unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts',

    '@acme-core/modules/<unit>/outbound/**',

    '@acme-core/modules/<unit>/infrastructure/core-adapters',
  ],
};
