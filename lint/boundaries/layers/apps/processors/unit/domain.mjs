export const appsProcessorsUnitDomain = {
  category: 'apps:processors:unit:domain',
  pattern: 'apps/*/src/processors/{*,*/modules/*}/domain/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/processors/<unit>/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
