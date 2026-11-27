export const appsFeaturesUnitDomain = {
  category: 'apps:features:unit:domain',
  pattern: 'apps/*/src/features/{*,*/modules/*}/domain/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/domain',

    '@acme-<app>/features/<unit>/domain',
  ],
};
