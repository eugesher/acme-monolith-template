export const appsCommonModulesUnitDomain = {
  category: 'apps:common:modules:unit:domain',
  pattern: 'apps/*/src/common/modules/*/domain/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-<app>/common/modules/<unit>/domain',
  ],
};
