export const coreModulesUnitDomain = {
  category: 'core:modules:unit:domain',
  pattern: 'core/modules/src/*/domain/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/domain',
    '@acme-core/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
