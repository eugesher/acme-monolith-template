export const coreModulesUnitInfrastructureLibAdapters = {
  category: 'core:modules:unit:infrastructure:lib-adapters',
  pattern: 'core/modules/src/*/infrastructure/lib-adapters/**',
  capture: ['unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
