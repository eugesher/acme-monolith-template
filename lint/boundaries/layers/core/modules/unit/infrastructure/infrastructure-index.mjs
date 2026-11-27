export const coreModulesUnitInfrastructureIndex = {
  category: 'core:modules:unit:infrastructure:index',
  pattern: 'core/modules/src/*/infrastructure/index.ts',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-core/modules/<unit>/infrastructure/cache',
    '@acme-core/modules/<unit>/infrastructure/config',
    '@acme-core/modules/<unit>/infrastructure/core-adapters',
    '@acme-core/modules/<unit>/infrastructure/persistence',
    '@acme-core/modules/<unit>/infrastructure/queue',
  ],
};
