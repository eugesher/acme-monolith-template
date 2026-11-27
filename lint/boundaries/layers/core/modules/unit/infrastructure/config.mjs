export const coreModulesUnitInfrastructureConfig = {
  category: 'core:modules:unit:infrastructure:config',
  pattern: 'core/modules/src/*/infrastructure/config/**',
  capture: ['unit'],
  allow: [
    '@nestjs/common',

    '@acme-libs/config',

    '@acme-core/modules/<unit>/outbound/**',

    '@acme-core/modules/<unit>/infrastructure/config',
  ],
};
