export const appsCommonModulesUnitDomain = {
  category: 'apps:common:modules:unit:domain',
  pattern: 'apps/*/src/common/modules/*/domain/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
