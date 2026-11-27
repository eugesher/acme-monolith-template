export const coreModulesUnitDomain = {
  category: 'core:modules:unit:domain',
  pattern: 'core/modules/src/*/domain/**',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-core/modules/<unit>/domain',
  ],
};
