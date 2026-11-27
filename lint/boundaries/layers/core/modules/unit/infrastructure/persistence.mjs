export const coreModulesUnitInfrastructurePersistence = {
  category: 'core:modules:unit:infrastructure:persistence',
  pattern: 'core/modules/src/*/infrastructure/persistence/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/modules/<unit>/infrastructure/persistence',
    '@acme-core/entities',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-libs/contracts/database',
    '@acme-libs/contracts/local-storage',
    '@nestjs/common',
    'typeorm',
  ],
};
