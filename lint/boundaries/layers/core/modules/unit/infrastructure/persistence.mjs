export const coreModulesUnitInfrastructurePersistence = {
  category: 'core:modules:unit:infrastructure:persistence',
  pattern: 'core/modules/src/*/infrastructure/persistence/**',
  capture: ['unit'],
  allow: [
    '@nestjs/common',
    'typeorm',

    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/contracts/database',
    '@acme-libs/contracts/local-storage',
    '@acme-core/entities',

    '@acme-core/modules/<unit>/outbound/**',

    '@acme-core/modules/<unit>/infrastructure/persistence',
  ],
};
