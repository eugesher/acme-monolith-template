export const coreModulesUnitInfrastructureLibAdapters = {
  category: 'core:modules:unit:infrastructure:lib-adapters',
  pattern: 'core/modules/src/*/infrastructure/lib-adapters/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@nestjs/common',
  ],
};
